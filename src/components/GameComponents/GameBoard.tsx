import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { captureFlipState, animateFlip } from './animations/dealCards';
import {
  Card,
  Suit,
  Rank,
  TablePair,
  GameRules,
  AttackValidationContext,
  DefendValidationContext,
  SlotValidationContext,
  GameState,
} from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';
import styles from './styles/GameBoard.module.css';
import { getCardStyle, getTrumpCardStyle } from './position/cardPositioning';
import { TABLE_PAIRS_POSITIONS } from './position/tablePairsPositions';
import { getSuitClass, getSuitSymbol } from './utils/suitSymbols';
import { defaultAttackRules } from './rules/attackRules';
import { defaultDefendRules } from './rules/defendRules';
import { defaultSlotRules } from './rules/slotRules';
import { useParams } from 'react-router';
import { initializeGameState } from './utils/gameStateHelpers';

gsap.registerPlugin(Draggable, Flip);


interface GameBoardProps {
  numPlayers: number;
  rules?: Partial<GameRules>;
}

const GameBoard: React.FC<GameBoardProps> = ({ rules = {} }) => {
  // Объединяем правила
  const mergedRules: GameRules = {
    maxTablePairs: rules.maxTablePairs || 6,
    distanceThreshold: rules.distanceThreshold || 200,
    initialHandSize: 6,
    attackRules: rules.attackRules || defaultAttackRules,
    defendRules: rules.defendRules || defaultDefendRules,
    slotRules: rules.slotRules || defaultSlotRules,
  };

  // Основные состояния
  const [cards, setCards] = useState<Card[]>([]);
  const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
  const [trumpCardId, setTrumpCardId] = useState<string | null>(null);
  const [tablePairs, setTablePairs] = useState<TablePair[]>(
    Array.from({ length: mergedRules.maxTablePairs }, () => ({
      attackCardId: null,
      coverCardId: null,
    }))
  );
  const [currentTurnRole, setCurrentTurnRole] = useState<'attack' | 'defend'>('attack');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [numPlayers, setNumPlayers] = useState<number>(0);
  // const [gameState, setGameState] = useState<GameState | null>(null);

  // Ссылки для анимации и проверки
  const gameState = useRef<GameState | null>(null);
  const tablePairsRef = useRef<TablePair[]>(tablePairs);
  const cardsRef = useRef<Card[]>(cards);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const newFlipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const discardCardsRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const draggableRefs = useRef<Record<string, Draggable>>({});
  const roleRef = useRef<'attack' | 'defend'>(currentTurnRole);
  const myIdRef = useRef<string>('');
  const hasReceivedSocketMessage = useRef(false);
  const initialDealDone = useRef(false);



  const { id: gameId } = useParams<{ id: string }>();


  useEffect(() => {
    tablePairsRef.current = tablePairs;
  }, [tablePairs]);

  useEffect(() => {
    cardsRef.current = cards;
  }, [cards]);

  useEffect(() => {
    roleRef.current = currentTurnRole;
  }, [currentTurnRole]);

  useEffect(() => {
    if (gameState.current) return;
    const { gameState: initialGameState, cards: initialCards } = initializeGameState(numPlayers);
    gameState.current = initialGameState;
    setCards(initialCards);
    // Если нужно, можно выполнить дополнительные действия, например, отправить состояние на сервер
    console.log('Initial game state:', initialGameState);
    flipStateRef.current = captureFlipState();
    console.log('flipStateRef.current', flipStateRef.current);
  }, [numPlayers]);

  

  // Функция парсинга строки карты (например, "6-H-f")
  const parseCard = (cardStr: string | undefined): { suit: Suit; rank: Rank } => {
    if (!cardStr || cardStr === '***') {
      // Возвращаем дефолтное значение (или можно вернуть null/throw, в зависимости от логики)
      return { suit: 'H' as Suit, rank: '6' as Rank };

    }
    const parts = cardStr.split('-');
    return { rank: parts[0] as Rank, suit: parts[1] as Suit };
  };
  

  
  // Подключаемся к WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`wss://durak-back.1k.games/api/v1/game/${gameId}/ws?token=${token}`);
    setSocket(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as GameState;
      gameState.current = data;
      setNumPlayers(data.data.state.players.length);
      if (!hasReceivedSocketMessage.current) {
        hasReceivedSocketMessage.current = true;
      }
      console.log('gameState', data);
    };
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    return () => {
      ws.close();
    };
  }, [gameId]);

  // Запуск Flip-анимации при изменении состояния карточек
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
    }
  }, [cards]);

  useEffect(() => {
    if (gameState.current && 
      cards.length > 0 && 
      hasReceivedSocketMessage.current && 
      !initialDealDone.current && 
      gameState.current.data.cards.length >= mergedRules.initialHandSize) {
      // Определяем, что пришло начальное состояние игры.
      // Можно добавить проверку по наличию массива карт в incomingState.
      const incomingState = gameState.current;

      flipStateRef.current = captureFlipState();
      // Обновляем карты: раздаем initialHandSize карт каждому игроку
      const updatedCards = dealInitialCards(
        incomingState,
        cards,
        numPlayers,           // число игроков
        mergedRules.initialHandSize  // например, 6
      );
      // Сохраняем обновленный массив карт
      setCards(updatedCards);
      initialDealDone.current = true;

      const serverDeck = incomingState.data.state.deck;
      if (serverDeck && serverDeck.length > 0) {
        const trumpString = serverDeck[serverDeck.length - 1];
        if (trumpString !== '***') {
          const { suit, rank } = parseCard(trumpString);
          const deckCards = updatedCards.filter(c => c.location === 'deck');
          if (deckCards.length > 0) {
            const trumpCard = deckCards[deckCards.length - 1];
            // Обновляем её масть и ранг согласно данным с сервера
            trumpCard.suit = suit;
            trumpCard.rank = rank;
            // Сохраняем id козырной карты и масть в state
            setTrumpCardId(trumpCard.stableId!);
            setTrumpSuit(suit);
          }
        }
      }
    }
  }, [gameState.current, cards, numPlayers, mergedRules.initialHandSize]);

  /**
 * Функция для первоначальной раздачи карт.
 * 
 * @param incomingState объект из сокета с данными игры (начальное состояние)
 * @param currentCards текущий массив карт (изначально с location: 'deck')
 * @param numPlayers количество игроков
 * @param initialHandSize сколько карт должно быть на руке
 * @returns обновленный массив карт
 */
const dealInitialCards = (
  incomingState: GameState,
  currentCards: Card[],
  numPlayers: number,
  initialHandSize: number
): Card[] => {
  // Копируем массив, чтобы не мутировать исходное состояние
  const updatedCards = [...currentCards];
  // Получаем массив строк для карт текущего игрока из объекта, пришедшего из сокета.
  // Например: ["6-H-f", "7-S-t", ...]
  const playerCardStrings: string[] = incomingState.data.cards;
  console.log('playerCardStrings', playerCardStrings);
  
  // Для удобства находим все карты, которые ещё в колоде
  let deckCards = updatedCards.filter((c) => c.location === 'deck');

  // Раздаем карты текущему игроку:
  for (let i = 0; i < initialHandSize; i++) {
    // Берем первую доступную карту из колоды
    const cardToDeal = deckCards.shift();
    if (!cardToDeal) break;
    // Берем соответствующую строку из пришедших данных
    const cardStr = playerCardStrings[i];
    if (!cardStr) continue;
    // Парсим строку, чтобы получить масть и ранг
    const { suit, rank } = parseCard(cardStr);
    // Обновляем свойства карты, не меняя stableId
    cardToDeal.suit = suit as Suit; // если у вас типизация Rank/Suit совпадает с передаваемыми значениями
    cardToDeal.rank = rank as Rank;
    cardToDeal.location = 'player';
  }

  // Обновляем массив deckCards после раздачи текущему игроку
  deckCards = updatedCards.filter((c) => c.location === 'deck');

  // Раздаем карты остальным игрокам.
  // Количество оппонентов = numPlayers - 1
  for (let opponentIndex = 0; opponentIndex < numPlayers - 1; opponentIndex++) {
    for (let i = 0; i < initialHandSize; i++) {
      const cardToDeal = deckCards.shift();
      if (!cardToDeal) break;
      // Для оппонента оставляем значение как есть ("***")
      // Просто меняем location и задаем seatIndex
      cardToDeal.location = 'opponent';
      cardToDeal.seatIndex = opponentIndex;
    }
  }

  // Возвращаем обновленный массив карт
  return updatedCards;
};


  // Обработка перетаскивания карт игрока
  useEffect(() => {
    const playerCards = cards.filter((c) => c.location === 'player');
    playerCards.forEach((card) => {
      if (draggableRefs.current[card.stableId!]) return;
      const el = document.querySelector(`[data-flip-id="${card.stableId}"]`);
      if (!el) return;

      const draggable = Draggable.create(el, {
        type: 'x,y',
        onPress: () => {
          newFlipStateRef.current = Flip.getState(el, { props: 'transform, top, left, zIndex' });
        },
        onDragEnd: () => {
          flipStateRef.current = Flip.getState(el, { props: 'transform, top, left, zIndex' });
          handlePlayerCardDrop(card.stableId!, flipStateRef.current!);
        },

      })[0];
      draggableRefs.current[card.stableId!] = draggable;
    });

    return () => {
      Object.keys(draggableRefs.current).forEach((cardId) => {
        const c = cards.find((cc) => cc.stableId === cardId);
        if (c && c.location !== 'player') {
          draggableRefs.current[cardId].kill();
          delete draggableRefs.current[cardId];
        }
      });

    };
  }, [cards]);

  // Функции валидации (оставляем без изменений)
  const validateAttack = (
    card: Card,
    freeIndex: number,
    cardCenter: { x: number; y: number }
  ) => {
    const attackContext: AttackValidationContext = {
      attackingCard: card,
      tableCards: cardsRef.current.filter((c) => c.location === 'table'),
      trumpSuit,
    };
    const slotPos = calculateSlotPosition(freeIndex, 'attack');
    const slotContext: SlotValidationContext = {
      cardPosition: cardCenter,
      slotPosition: slotPos,
      maxDistance: mergedRules.distanceThreshold,
    };
    return {
      attackValid: mergedRules.attackRules.every((r) => r.validator(attackContext)),
      slotValid: mergedRules.slotRules.every((r) => r.validator(slotContext)),
    };
  };

  const validateDefense = (
    defendingCard: Card,
    attackingCard: Card,
    slotIndex: number,
    cardCenter?: { x: number; y: number }
  ) => {
    const defendContext: DefendValidationContext = {
      attackingCard,
      defendingCard,
      trumpSuit,
    };
    let slotValid = true;
    if (cardCenter) {
      const slotPos = calculateSlotPosition(slotIndex, 'cover');
      const slotContext: SlotValidationContext = {
        cardPosition: cardCenter,
        slotPosition: slotPos,
        maxDistance: mergedRules.distanceThreshold,
      };
      slotValid = mergedRules.slotRules.every((r) => r.validator(slotContext));
    }
    const defendValid = mergedRules.defendRules.every((r) => r.validator(defendContext));
    return { defendValid, slotValid };
  };

  const calculateSlotPosition = (index: number, type: 'attack' | 'cover') => {
    const { top, left } = TABLE_PAIRS_POSITIONS[index][type];
    const gameRect = gameBoardRef.current!.getBoundingClientRect();
    return {
      x: gameRect.left + (gameRect.width * left) / 100,
      y: gameRect.top + (gameRect.height * top) / 100,
    };
  };

  // Обработка дропа карты игрока (с проверками расстояния и анимацией)
  const handlePlayerCardDrop = (
    cardId: string,
    flipState: ReturnType<typeof Flip.getState>
  ) => {
    if (!gameBoardRef.current || !newFlipStateRef.current) return;
    const el = document.querySelector(`[data-flip-id="${cardId}"]`) as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cardCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    const currentCard = cardsRef.current.find((c) => c.stableId === cardId);
    if (!currentCard) return;


    if (currentTurnRole === 'attack') {
      const freeIndex = tablePairsRef.current.findIndex((p) => p.attackCardId === null);
      if (freeIndex === -1) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      const { attackValid, slotValid } = validateAttack(currentCard, freeIndex, cardCenter);
      if (!attackValid || !slotValid) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      placeAttackCard(cardId, freeIndex, flipState);
    } else {
      let foundIndex: number | null = null;
      for (let i = 0; i < tablePairsRef.current.length; i++) {
        const pair = tablePairsRef.current[i];
        if (!pair.attackCardId || pair.coverCardId) continue;
        const slotPos = calculateSlotPosition(i, 'cover');
        const dist = Math.hypot(cardCenter.x - slotPos.x, cardCenter.y - slotPos.y);
        if (dist <= mergedRules.distanceThreshold) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex === null) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      const attackCardId = tablePairsRef.current[foundIndex].attackCardId;
      if (!attackCardId) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      const attackCard = cardsRef.current.find((c) => c.stableId === attackCardId);
      if (!attackCard) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }

      const { defendValid, slotValid } = validateDefense(currentCard, attackCard, foundIndex, cardCenter);
      if (!defendValid || !slotValid) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      placeCoverCard(cardId, foundIndex, flipState);
    }
  };

  // Функция выкладки карты для атаки: обновляем состояние и отсылаем событие на сервер
  const placeAttackCard = (
    cardId: string,
    pairIndex: number,
    flipState: ReturnType<typeof Flip.getState>
  ) => {
    setTablePairs((prev) =>
      prev.map((p, i) => (i === pairIndex ? { ...p, attackCardId: cardId } : p))
    );
    setCards((prev) =>
      prev.map((c) =>
        c.stableId === cardId
          ? { ...c, location: 'table', tablePairIndex: pairIndex, tableRole: 'attack' }
          : c
      )
    );

    Flip.from(flipState, { duration: 0.8, ease: 'power2.out', absolute: true, scale: true });
    const placedCard = cardsRef.current.find((c) => c.stableId === cardId);
    if (placedCard) {
      const eventObj = {
        player_id: myIdRef.current,
        type: 'attack_card',
        defending_card: null,
        attacking_card: `${placedCard.rank}-${placedCard.suit}-f`,

      };
      socket?.send(JSON.stringify(eventObj));
    }
  };

  // Функция выкладки карты для защиты: обновляем состояние и отсылаем событие на сервер
  const placeCoverCard = (
    cardId: string,
    pairIndex: number,
    flipState: ReturnType<typeof Flip.getState>
  ) => {
    setTablePairs((prev) =>
      prev.map((p, i) => (i === pairIndex ? { ...p, coverCardId: cardId } : p))
    );
    setCards((prev) =>
      prev.map((c) =>
        c.stableId === cardId
          ? { ...c, location: 'table', tablePairIndex: pairIndex, tableRole: 'cover' }
          : c
      )
    );

    Flip.from(flipState, { duration: 0.8, ease: 'power2.out', absolute: true, scale: true });
    const placedCard = cardsRef.current.find((c) => c.stableId === cardId);

    if (placedCard) {
      const eventObj = {
        player_id: myIdRef.current,
        type: 'defend_card',
        attacking_card: null,
        defending_card: `${placedCard.rank}-${placedCard.suit}-f`,
      };
      socket?.send(JSON.stringify(eventObj));
    }
  };

  const revertCard = (cardId: string, oldState: ReturnType<typeof Flip.getState>) => {
    Flip.to(oldState, { duration: 0.8, ease: 'power4.out', absolute: true, zIndex: 100 });
  };

  const hasAtLeastOneAttack = tablePairsRef.current.some((p) => p.attackCardId !== null);
  const allAttacksCovered = tablePairsRef.current.every((p) => !p.attackCardId || p.coverCardId);
  const isBeatVisible = hasAtLeastOneAttack && allAttacksCovered;

  const handleBeat = () => {
    const coveredCardIds = tablePairsRef.current.flatMap((p) =>
      p.attackCardId && p.coverCardId ? [p.attackCardId, p.coverCardId] : []
    );
    discardCardsRef.current = Flip.getState(
      coveredCardIds
        .map((id) => document.querySelector(`[data-flip-id="${id}"]`))
        .filter(Boolean) as HTMLElement[],
      { props: 'transform, top, left, zIndex' }
    );
    setCards((prev) =>
      prev.map((c) => (coveredCardIds.includes(c.stableId!) ? { ...c, location: 'discard' } : c))
    );

    setTablePairs((prev) =>
      prev.map((p) => (p.attackCardId && p.coverCardId ? { attackCardId: null, coverCardId: null } : p))
    );
  };

  const handleDealAfterBeat = () => {
    flipStateRef.current = captureFlipState();
    setCards((prev) => {
      const updated = [...prev];
      const deckCards = updated.filter((c) => c.location === 'deck');
      let deckPos = 0;
      const refillHand = (location: 'player' | 'opponent', seat?: number) => {
        const currentCount = updated.filter(
          (c) => c.location === location && (seat === undefined || c.seatIndex === seat)
        ).length;
        const needed = mergedRules.initialHandSize - currentCount;
        for (let i = 0; i < needed && deckPos < deckCards.length; i++) {
          deckCards[deckPos].location = location;
          if (seat !== undefined) deckCards[deckPos].seatIndex = seat;
          deckPos++;
        }
      };
      refillHand('player');
      for (let seat = 0; seat < numPlayers - 1; seat++) {
        refillHand('opponent', seat);
      }
      return updated;
    });
    setCurrentTurnRole('attack');
  };

  useLayoutEffect(() => {
    if (discardCardsRef.current) {
      Flip.from(discardCardsRef.current, {
        duration: 1,
        ease: 'power2.out',
        absolute: true,
        scale: true,
        onComplete: () => {
          discardCardsRef.current = null;
          handleDealAfterBeat();
        },
      });
    }
  }, [cards]);

  const handleTakeCards = () => {
    flipStateRef.current = captureFlipState();
    const tableCardIds = tablePairsRef.current.flatMap((p) =>
      [p.attackCardId, p.coverCardId].filter(Boolean) as string[]
    );
    setCards((prev) =>
      prev.map((c) =>
        tableCardIds.includes(c.stableId!)
          ? { ...c, location: 'player', tablePairIndex: undefined, tableRole: undefined }
          : c
      )
    );

    setTablePairs((prev) => prev.map(() => ({ attackCardId: null, coverCardId: null })));
  };

  const isTakeVisible = tablePairs.some((p) => p.attackCardId && !p.coverCardId);

  const handleOpponentMove = () => {
    const uncoveredIndex = tablePairs.findIndex((p) => p.attackCardId && !p.coverCardId);
    if (uncoveredIndex === -1) {
      console.log('Нет непокрытых атак — ход противника не нужен');
      return;
    }
    const attackCardId = tablePairs[uncoveredIndex].attackCardId!;
    const attackCard = cards.find((c) => c.stableId === attackCardId);
    if (!attackCard) return;
    const oppCards = cards.filter((c) => c.location === 'opponent');
    flipStateRef.current = captureFlipState();

    const suitableCard = oppCards.find((defCard) => {
      const { defendValid } = validateDefense(defCard, attackCard, uncoveredIndex);
      return defendValid;
    });
    if (!suitableCard) {
      console.log('Противник не смог покрыть — нет подходящей карты');
      return;
    }
    placeCoverCard(suitableCard.stableId!, uncoveredIndex, flipStateRef.current!);
  };


  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>
      <OpponentsContainer numPlayers={numPlayers} allOpponentCards={cards.filter((c) => c.location === 'opponent')} />
      <Player
        onBeat={handleBeat}
        cards={cards.filter((c) => c.location === 'player')}
        onTakeCards={handleTakeCards}
        isBeatVisible={isBeatVisible}
        isTakeVisible={isTakeVisible}
      />
      <div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
        <p>Current role: {currentTurnRole}</p>
        <button onClick={() => setCurrentTurnRole('attack')}>Attack</button>
        <button onClick={() => setCurrentTurnRole('defend')}>Defend</button>
        <button onClick={handleOpponentMove}>Ход противника</button>
      </div>
      {tablePairs.map((pair, i) => {
        const pos = TABLE_PAIRS_POSITIONS[i];
        if (!pos) return null;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: 'absolute',
                top: `${pos.attack.top}%`,
                left: `${pos.attack.left}%`,
                width: '50px',
                height: '70px',
                backgroundColor: pair.attackCardId ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)',
                border: pair.attackCardId ? '1px dashed green' : '2px solid red',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: `${pos.cover.top}%`,
                left: `${pos.cover.left}%`,
                width: '50px',
                height: '70px',
                backgroundColor: pair.coverCardId ? 'rgba(0,255,0,0.2)' : 'rgba(255,0,0,0.3)',
                border: pair.coverCardId ? '1px dashed green' : '2px solid red',
                pointerEvents: 'none',
              }}
            />
          </React.Fragment>
        );
      })}
      {trumpSuit && (
        <div className={styles.trumpIndicator} style={{ color: getSuitClass(trumpSuit) }}>
          {getSuitSymbol(trumpSuit)}
        </div>
      )}
      <button
        onClick={() => {
          socket?.send(
            JSON.stringify({
              player_id: '1',
              type: 'attack_pass',
              defending_card: null,
              attacking_card: null,
            })
          );
        }}
      >
        send event
      </button>
      {cards.map((card) => {
        const style =
          card.stableId === trumpCardId && card.location === 'deck'
            ? getTrumpCardStyle()
            : getCardStyle(card, cards, numPlayers);

        return (
          <CardItem
            key={card.stableId}
            card={card}
            trumpSuit={trumpSuit}
            style={style}
            isDraggable={card.location === 'player'}
            isFaceUp={

              ['player', 'table'].includes(card.location) ||
              (card.stableId === trumpCardId && card.location === 'deck')
            }
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
