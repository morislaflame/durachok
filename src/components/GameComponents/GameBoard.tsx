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
  PlayerState,
  GameActions,
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
  const [currentTurnRole, setCurrentTurnRole] = useState<'attack' | 'defend' | 'watching'>('watching');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [numPlayers, setNumPlayers] = useState<number>(0);

  const gameState = useRef<GameState | null>(null);
  
  const prevGameStateRef = useRef<GameState | null>(null);
  const [gameActionState, setGameActionState] = useState<GameActions | null>(null);

  const tablePairsRef = useRef<TablePair[]>(tablePairs);
  const cardsRef = useRef<Card[]>(cards);
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const newFlipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const draggableRefs = useRef<Record<string, Draggable>>({});
  const roleRef = useRef<'attack' | 'defend' | 'watching'>(currentTurnRole);
  const myIdRef = useRef<number>(0);
  const hasReceivedSocketMessage = useRef(false);
  const initialDealDone = useRef(false);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [opponents, setOpponents] = useState<PlayerState[]>([]);
  const [cardsTaken, setCardsTaken] = useState<boolean>(false);
  const [isBeaten, setIsBeaten] = useState<boolean>(false);

  interface CardsTakenDetails {
    tableTaker: PlayerState | null;           // игрок, который взял карты со стола
    deckIncreases: { [playerId: string]: number }; // для каждого другого игрока число добавленных карт из колоды
    currentPlayerDiff: string[];
  }
  
  const [cardsTakenDetails, setCardsTakenDetails] = useState<CardsTakenDetails | null>(null);
  const prevPlayerCardsRef = useRef<string[]>([]);



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
    console.log('players', players);
  }, [players]);

  useEffect(() => {
    console.log('gameActionState', gameActionState);
  }, [gameActionState]);



  useEffect(() => {
    if (gameState.current) return;
    const { gameState: initialGameState, cards: initialCards } = initializeGameState(numPlayers);
    gameState.current = initialGameState;
    setCards(initialCards);

    console.log('Initial game state:', initialGameState);
    flipStateRef.current = captureFlipState();
    console.log('flipStateRef.current', flipStateRef.current);
  }, [numPlayers]);

  useEffect(() => {
    if (!gameState.current || !gameState.current.data?.actions) return;
  
    const actions = gameState.current.data.actions;
  
    if (actions.some(action => action.type === 'defend_card' || action.type === 'defend_take')) {
      setCurrentTurnRole('defend');
    } else if (actions.some(action => action.type === 'attack_card' || action.type === 'attack_pass')) {
      setCurrentTurnRole('attack');
    } else {
      // Если ни одно из действий не найдено, считаем, что никто не ходит – режим наблюдения.
      setCurrentTurnRole('watching');
    }
    console.log('currentTurnRole', currentTurnRole);
  }, [gameState.current]);
  

  // Функция парсинга строки карты (например, "6-H-f")
  const parseCard = (cardStr: string | undefined): { suit: Suit; rank: Rank, trumpFlag: 'f' | 't'; } => {
    if (!cardStr || cardStr === '***') {
      // Возвращаем дефолтное значение (или можно вернуть null/throw, в зависимости от логики)
      return { suit: 'H' as Suit, rank: '6' as Rank, trumpFlag: 'f' };

    }
    const parts = cardStr.split('-');
    return { rank: parts[0] as Rank, suit: parts[1] as Suit, trumpFlag: parts[2] as 'f' | 't' };
  };
  

  
  // Подключаемся к WebSocket
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`wss://durak-back.1k.games/api/v1/game/${gameId}/ws?token=${token}`);
    setSocket(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data) as GameState | GameActions;
      if (data.type === 'game_action') {
        setGameActionState(data as GameActions);
        console.log('gameActionState', gameActionState);
      } else {
        gameState.current = data;
        const playersLength = data.data?.state?.players?.length;

      if (playersLength !== undefined) {
        setNumPlayers(playersLength);
        setPlayers(data.data.state.players);
      } else {
        console.warn('Получено сообщение без состояния или без игроков:', data);
      }

      if (!hasReceivedSocketMessage.current) {
        hasReceivedSocketMessage.current = true;
      }
      console.log('gameState', data);
      }
      
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
      !initialDealDone.current ) {
      // Определяем, что пришло начальное состояние игры.
      // Можно добавить проверку по наличию массива карт в incomingState.
      const incomingState = gameState.current;
      myIdRef.current = incomingState.user_id;
      console.log('myIdRef.current', myIdRef.current);
      
        const allPlayers = incomingState.data.state.players;
        console.log('allPlayers', allPlayers);

        const currentIndex = allPlayers.findIndex(p => Number(p.id) === Number(myIdRef.current));
        console.log('currentIndex', currentIndex);

        const orderedPlayers =
          currentIndex >= 0
            ? [...allPlayers.slice(currentIndex), ...allPlayers.slice(0, currentIndex)]
            : allPlayers;
        console.log('orderedPlayers', orderedPlayers);
        
        const localOpponents = orderedPlayers.slice(1);
        // console.log('players', players);
        setPlayers(orderedPlayers);
        setOpponents(localOpponents);

        const currentPlayerHandSize = incomingState.data.cards.length;
        console.log('currentPlayerHandSize', currentPlayerHandSize);

        flipStateRef.current = captureFlipState();

      const updatedCards = dealInitialCards(
        incomingState,
        cards,
        numPlayers,           // число игроков
        currentPlayerHandSize,  // например, 6
        localOpponents
      );
      // Сохраняем обновленный массив карт

      setCards(updatedCards);
      initialDealDone.current = true;

      const serverDeck = incomingState.data.state.deck;
      if (serverDeck && serverDeck.length > 0) {
        const trumpString = serverDeck[serverDeck.length - 1];
        if (trumpString !== '***') {
          const { suit, rank, trumpFlag } = parseCard(trumpString);
          const deckCards = updatedCards.filter(c => c.location === 'deck');
          if (deckCards.length > 0) {
            const trumpCard = deckCards[deckCards.length - 1];
            trumpCard.suit = suit;
            trumpCard.rank = rank;
            trumpCard.trumpFlag = trumpFlag;
            setTrumpCardId(trumpCard.stableId!);
            setTrumpSuit(suit);
          }
        }
      }
    }
  }, [gameState.current, cards, numPlayers]);

  /**
 * Функция для первоначальной раздачи карт.
 * 
 * @param incomingState объект из сокета с данными игры (начальное состояние)
 * @param currentCards текущий массив карт (изначально с location: 'deck')
 * @param numPlayers количество игроков
 * @returns обновленный массив карт
 */
const dealInitialCards = (
  incomingState: GameState,
  currentCards: Card[],
  numPlayers: number,
  currentPlayerHandSize: number,
  opponents: PlayerState[]

): Card[] => {
  // Копируем массив, чтобы не мутировать исходное состояние
  const updatedCards = [...currentCards];

  const playerCardStrings: string[] = incomingState.data.cards;
  console.log('playerCardStrings', playerCardStrings);
  
  // Для удобства находим все карты, которые ещё в колоде
  let deckCards = updatedCards.filter((c) => c.location === 'deck');

  for (let i = 0; i < currentPlayerHandSize; i++) {
    // Берем первую доступную карту из колоды
    const cardToDeal = deckCards.shift();
    if (!cardToDeal) break;
    // Берем соответствующую строку из пришедших данных
    const cardStr = playerCardStrings[i];
    if (!cardStr) continue;
    // Парсим строку, чтобы получить масть и ранг
    const { suit, rank, trumpFlag } = parseCard(cardStr);
    // Обновляем свойства карты, не меняя stableId
    cardToDeal.suit = suit as Suit; // если у вас типизация Rank/Suit совпадает с передаваемыми значениями
    cardToDeal.rank = rank as Rank;
    cardToDeal.trumpFlag = trumpFlag;
    cardToDeal.location = 'player';
    cardToDeal.playerId = myIdRef.current;
  }

  // Обновляем массив deckCards после раздачи текущему игроку
  deckCards = updatedCards.filter((c) => c.location === 'deck');

  console.log('opponents', opponents);
  opponents.forEach((opponent, index) => {
    const opponentHandSize = opponent.cards?.length || currentPlayerHandSize;
    for (let i = 0; i < opponentHandSize; i++) {
      const cardToDeal = deckCards.shift();
      if (!cardToDeal) break;
      cardToDeal.location = 'opponent';
      cardToDeal.playerId = Number(opponent.id);

      console.log('cardToDeal', cardToDeal);
      cardToDeal.seatIndex = index;

    }
  });

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
  
    console.log('validateDefense: defendingCard=', defendingCard);
    console.log('validateDefense: attackingCard=', attackingCard);
    console.log('validateDefense: trumpSuit=', trumpSuit);
  
    let slotValid = true;
    if (cardCenter) {
      const slotPos = calculateSlotPosition(slotIndex, 'cover');
      const slotContext: SlotValidationContext = {
        cardPosition: cardCenter,
        slotPosition: slotPos,
        maxDistance: mergedRules.distanceThreshold,
      };
      slotValid = mergedRules.slotRules.every((r) => {
        const result = r.validator(slotContext);
        return result;
      });
    }
    const defendValid = mergedRules.defendRules.every((r) => {
      const result = r.validator(defendContext);
      return result;
    });
    console.log('validateDefense returns:', { defendValid, slotValid });
    return { defendValid, slotValid, attackingCard, defendingCard };
  };
  

  const calculateSlotPosition = (index: number, type: 'attack' | 'cover') => {
    const { top, left } = TABLE_PAIRS_POSITIONS[index][type];
    const gameRect = gameBoardRef.current!.getBoundingClientRect();
    return {
      x: gameRect.left + (gameRect.width * left) / 100,
      y: gameRect.top + (gameRect.height * top) / 100,
    };
  };

  const isActionAllowed = (actionType: string, cardString: string): boolean => {
    if (!gameState.current) return false;
    
    return gameState.current.data.actions.some((action) => {
      
      if (actionType === 'attack_card') {
        // Для атаки допускается только если attacking_card соответствует, а defending_card равен null
        return action.type === 'attack_card' &&
               action.attacking_card === cardString &&
               action.defending_card === null;
      } else if (actionType === 'defend_card') {
        const condition = (action.type === 'defend_card' || action.type === 'defend_take') &&
             action.defending_card === cardString
            //  action.attacking_card === null;
      console.log('Проверка действия для защиты:', action, 'с условием', condition);
      return condition;
      }
      return false;
    });
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

    if (roleRef.current === 'watching') {
      revertCard(cardId, newFlipStateRef.current);
      return;
    }


    if (roleRef.current === 'attack') {
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
      const cardString = `${currentCard.rank}-${currentCard.suit}-${currentCard.trumpFlag}`;
      const allowed = isActionAllowed('attack_card', cardString);
      if (!allowed) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      placeAttackCard(cardId, freeIndex, flipState);


    } else {
      console.log('Защитная ветка: roleRef.current =', roleRef.current);
      console.log('Защитная обработка: cardCenter =', cardCenter);
      let foundIndex: number | null = null;
      for (let i = 0; i < tablePairsRef.current.length; i++) {
        const pair = tablePairsRef.current[i];
        console.log(`Проверка слота ${i}: attackCardId=${pair.attackCardId}, coverCardId=${pair.coverCardId}`);
        if (!pair.attackCardId || pair.coverCardId) {
          console.log(`Слот ${i} пропущен: либо нет attackCardId, либо уже есть coverCardId`);
          continue;
        }
        const slotPos = calculateSlotPosition(i, 'cover');
        const dist = Math.hypot(cardCenter.x - slotPos.x, cardCenter.y - slotPos.y);
        console.log(`Слот ${i}: slotPos =`, slotPos, `, расстояние =`, dist);
        if (dist <= mergedRules.distanceThreshold) {
          foundIndex = i;
          console.log(`Найден подходящий слот: ${i}`);
          break;
        }
      }
      
      if (foundIndex === null) {
        revertCard(cardId, newFlipStateRef.current);
        console.log('foundIndex === null');
        return;
      }
      const attackCardId = tablePairsRef.current[foundIndex].attackCardId;
      if (!attackCardId) {
        revertCard(cardId, newFlipStateRef.current);
        console.log('attackCardId === null');
        return;
      }
      const attackCard = cardsRef.current.find((c) => c.stableId === attackCardId);
      if (!attackCard) {
        revertCard(cardId, newFlipStateRef.current);
        console.log('attackCard === null');
        return;
      }

      const { defendValid, slotValid, attackingCard, defendingCard } = validateDefense(currentCard, attackCard, foundIndex, cardCenter);
      if (!defendValid || !slotValid) {
        revertCard(cardId, newFlipStateRef.current);
        console.log('defendValid || !slotValid');
        return;
      }

      const cardString = `${currentCard.rank}-${currentCard.suit}-${currentCard.trumpFlag}`;
      const allowed = isActionAllowed('defend_card', cardString);
      if (!allowed) {
        revertCard(cardId, newFlipStateRef.current);
        console.log('allowed === false');
        return;
      }
      placeCoverCard(cardId, foundIndex, flipState, attackingCard, defendingCard);

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

    Flip.from(flipState, {
      duration: 0.8,
      ease: 'power2.out',
      absolute: true,
      scale: true,
      onComplete: () => {
        // После завершения анимации находим выложенную карту
        const placedCard = cardsRef.current.find((c) => c.stableId === cardId);
        if (!placedCard) return;
        // Формируем строку для отправки, используя сохранённое свойство trumpFlag
        const trumpFlag = placedCard.trumpFlag || 'f';
        const cardString = `${placedCard.rank}-${placedCard.suit}-${trumpFlag}`;
        
        // Формируем и отправляем событие на сервер
        const eventObj = {
          player_id: myIdRef.current.toString(),
          type: 'attack_card',
          defending_card: null,
          attacking_card: cardString,
        };
        // const attackPass = {
        //   player_id: myIdRef.current.toString(),
        //   type: 'attack_pass',
        //   defending_card: null,
        //   attacking_card: null
        // }

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(eventObj));
          // socket.send(JSON.stringify(attackPass));
        } else {
          console.error("Socket is not open, readyState:", socket?.readyState);
        }
      },
    });
  };

  // Функция выкладки карты для защиты: обновляем состояние и отсылаем событие на сервер
  const placeCoverCard = (
    cardId: string,
    pairIndex: number,
    flipState: ReturnType<typeof Flip.getState>,
    attackingCard: Card,
    defendingCard: Card
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

    Flip.from(flipState, {
      duration: 0.8,
      ease: 'power2.out',
      absolute: true,
      scale: true,
      onComplete: () => {

        const defendingCardString = `${defendingCard.rank}-${defendingCard.suit}-${defendingCard.trumpFlag}`;
        const attackingCardString = `${attackingCard.rank}-${attackingCard.suit}-${attackingCard.trumpFlag}`;
        
        // Формируем и отправляем событие для защиты
        const eventObj = {
          player_id: myIdRef.current.toString(),
          type: 'defend_card',
          attacking_card: attackingCardString,
          defending_card: defendingCardString,
        };
        socket?.send(JSON.stringify(eventObj));
        

      },
    });
  };

  const revertCard = (cardId: string, oldState: ReturnType<typeof Flip.getState>) => {
    Flip.to(oldState, { duration: 0.8, ease: 'power4.out', absolute: true, zIndex: 100 });
  };

  useEffect(() => {
    if (gameActionState?.type !== 'game_action') return;
  
    const action = gameActionState.data;
 
    if (action.type === 'attack_card') {
      flipStateRef.current = captureFlipState();
      // Обработка атаки (как было раньше)
      const { rank, suit, trumpFlag } = parseCard(action.attacking_card || '');
      const attackingPlayerId = Number(action.player_id);
  
      // Находим свободный слот для атаки
      const freeIndex = tablePairsRef.current.findIndex((p) => p.attackCardId === null);
      if (freeIndex === -1) return;
  
      // Ищем последнюю карту в руке оппонента с нужным playerId
      const found = cardsRef.current
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.playerId === attackingPlayerId && c.location === 'opponent')[0];

      if (!found) return;
      const { c: cardToMove } = found;
      const cardId = cardToMove.stableId;
      if (!cardId) return;
  
      // Обновляем слот для атаки
      setTablePairs((prev) =>
        prev.map((p, i) => (i === freeIndex ? { ...p, attackCardId: cardId } : p))
      );
      // Обновляем карту, чтобы она перешла на стол
      setCards((prev) =>
        prev.map((c) =>
          c.stableId === cardId
            ? {
                ...c,
                location: 'table',
                tablePairIndex: freeIndex,
                tableRole: 'attack',
                rank,
                suit,
                trumpFlag,
              }
            : c
        )
      );
    } else if (action.type === 'defend_card') {
      flipStateRef.current = captureFlipState();

      const { rank, suit, trumpFlag } = parseCard(action.defending_card || '');
      const defendingPlayerId = Number(action.player_id);
  
      // Находим слот, в котором уже есть атакующая карта, но еще нет защитной
      const freeIndex = tablePairsRef.current.findIndex((p) => p.attackCardId && !p.coverCardId);
      if (freeIndex === -1) return;
  
      // Ищем последнюю карту в руке оппонента с нужным playerId (предполагаем, что защитой ходит этот игрок)
      const found = cardsRef.current
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => c.playerId === defendingPlayerId && c.location === 'opponent')[0];
      if (!found) return;
      const { c: cardToMove } = found;
      const cardId = cardToMove.stableId;
      if (!cardId) return;

  
      // Обновляем слот для защиты – проставляем coverCardId
      setTablePairs((prev) =>
        prev.map((p, i) => (i === freeIndex ? { ...p, coverCardId: cardId } : p))
      );
      // Обновляем карту, чтобы она перешла в слот на столе как защитная
      setCards((prev) =>
        prev.map((c) =>
          c.stableId === cardId
            ? {
                ...c,
                location: 'table',
                tablePairIndex: freeIndex,
                tableRole: 'cover',
                rank,
                suit,
                trumpFlag,
              }
            : c
        )
      );
    }
    console.log('gameActionState', gameActionState);
  }, [gameActionState]);



  useEffect(() => {
  if (!gameState.current) return;
  const prevState = prevGameStateRef.current?.data.state;
  const newState = gameState.current.data.state;
  // console.log('prevState', prevState);
  // console.log('newState', newState);
  if (!prevState || !newState) {
    prevGameStateRef.current = gameState.current;
    if (gameState.current.data.cards) {
      prevPlayerCardsRef.current = [...gameState.current.data.cards];
    }
    return;
  }

  // Логика для взятия карт:
  if (prevState.table.some(slot => slot.defender_taking === true) && newState.table.length === 0) {
    let tableTaker: PlayerState | null = null;
    const deckIncreases: { [playerId: string]: number } = {};
    let currentPlayerDiff: string[] = [];
    
    newState.players.forEach(newPlayer => {
      const prevPlayer = prevState.players.find(p => p.id === newPlayer.id);
      if (!prevPlayer) return;
      
      if (newPlayer.id === myIdRef.current.toString()) {
        // Для текущего игрока сравниваем data.cards, а не newPlayer.cards!
        const prevCards = prevPlayerCardsRef.current;
        const newCards = gameState.current?.data.cards || [];
        const diff = newCards.filter(cardStr => !prevCards.includes(cardStr));

        if (diff.length > 0) {
          // Если текущий игрок находится в режиме защиты (то есть, он взял карты со стола),
          // то он должен получить именно карты со стола, а не из колоды.
          if (newPlayer.is_defending) {
            tableTaker = newPlayer;
          } else {
            deckIncreases[newPlayer.id] = diff.length;
            currentPlayerDiff = diff;
          }
        }
      } else {
        const diff = newPlayer.cards.length - prevPlayer.cards.length;
        if (diff > 0) {
          if (newPlayer.is_defending) {
            tableTaker = newPlayer;
          } else {
            deckIncreases[newPlayer.id] = diff;
          }
        }
      }
    });
    
    setCardsTakenDetails({ tableTaker, deckIncreases, currentPlayerDiff });
    setCardsTaken(true);
  }
  
  // Логика для битого:
  const prevTableCount = prevState.table.reduce((acc, slot) => {
    const count = (slot.attacking ? 1 : 0) + (slot.defending ? 1 : 0);
    return acc + count;
  }, 0);
  
  const prevBeatenCount = prevState.beaten.length;
  if (prevTableCount > 0 && newState.table.length === 0) {
    const beatenIncrease = newState.beaten.length - prevBeatenCount;
    if (beatenIncrease >= prevTableCount) {
      // В случае битого (исключаем tableTaker)
      const deckIncreases: { [playerId: string]: number } = {};
      let currentPlayerDiff: string[] = [];
      newState.players.forEach(newPlayer => {
        const prevPlayer = prevState.players.find(p => p.id === newPlayer.id);
        if (!prevPlayer) return;
        if (newPlayer.id === myIdRef.current.toString()) {
          const prevCards = prevPlayerCardsRef.current;
          const newCards = gameState.current?.data.cards || [];
          const diff = newCards.filter(cardStr => !prevCards.includes(cardStr));
          if (diff.length > 0) {
            deckIncreases[newPlayer.id] = diff.length;
            currentPlayerDiff = diff;
          }
        } else {
          const diff = newPlayer.cards.length - prevPlayer.cards.length;
          if (diff > 0) {
            deckIncreases[newPlayer.id] = diff;
          }
        }
      });
      // В битом случае tableTaker остается null
      setCardsTakenDetails({ tableTaker: null, deckIncreases, currentPlayerDiff });
      setIsBeaten(true);
    }
  }
  
  
  // Обновляем prevGameStateRef
  prevGameStateRef.current = gameState.current;
  if (gameState.current.data.cards) {
    prevPlayerCardsRef.current = [...gameState.current.data.cards];
  }
}, [gameState.current]);

useEffect(() => {
  if (!cardsTaken) return;
  if (!gameState.current || !cardsTakenDetails) return;

  flipStateRef.current = captureFlipState();
  const { tableTaker, deckIncreases, currentPlayerDiff } = cardsTakenDetails;

  // Если есть tableTaker – переносим все карты со стола в его руку:
  if (tableTaker) {
    setCards(prevCards =>
      prevCards.map(card =>
        card.location === 'table'
          ? {
              ...card,
              location: Number(tableTaker.id) === myIdRef.current ? 'player' : 'opponent',
              playerId: Number(tableTaker.id),
              tablePairIndex: undefined,
              tableRole: undefined,
            }
          : card
      )
    );
  }

  // Для каждого игрока, у которого разница положительна:
  Object.entries(deckIncreases).forEach(([playerId, addedCount]) => {
    if (Number(playerId) === myIdRef.current) {
      // Для текущего игрока используем currentPlayerDiff
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        currentPlayerDiff.forEach((cardStr) => {
          const deckIndex = updatedCards.findIndex(c => c.location === 'deck');
          if (deckIndex !== -1) {
            const { suit, rank, trumpFlag } = parseCard(cardStr);
            updatedCards[deckIndex] = {
              ...updatedCards[deckIndex],
              suit,
              rank,
              trumpFlag,
              location: 'player',
              playerId: myIdRef.current,
            };
          } else {
            console.warn(`[cardsTaken] Нет карты в колоде для текущего игрока при обработке "${cardStr}"`);
          }
        });
        return updatedCards;
      });
    } else {
      // Для оппонентов – просто переводим нужное количество карт
      const opponentId = Number(playerId);
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        for (let i = 0; i < addedCount; i++) {
          const deckIndex = updatedCards.findIndex(c => c.location === 'deck');
          if (deckIndex !== -1) {
            updatedCards[deckIndex] = {
              ...updatedCards[deckIndex],
              location: 'opponent',
              playerId: opponentId,
            };
          } else {
            console.warn(`[cardsTaken] Нет карты в колоде для оппонента ${opponentId} на итерации ${i}`);
          }
        }
        return updatedCards;
      });
    }
  });

  // Очистка стола
  setTablePairs(() =>
    Array.from({ length: mergedRules.maxTablePairs }, () => ({
      attackCardId: null,
      coverCardId: null,
    }))
  );

  setCardsTaken(false);
  setCardsTakenDetails(null);
}, [cardsTaken]);



// Эффект для обработки флага isBeaten (битый)
useEffect(() => {
  if (!isBeaten) return;
  if (!gameState.current || !cardsTakenDetails) return;

  // Захватываем flip-стейт для анимации (если требуется)
  flipStateRef.current = captureFlipState();

  // 1. Перемещаем все карты, находящиеся на столе, в discard
  setCards(prevCards =>
    prevCards.map(card =>
      card.location === 'table'
        ? { ...card, location: 'discard' }
        : card
    )
  );

  // 2. Очищаем слоты стола
  setTablePairs(() =>
    Array.from({ length: mergedRules.maxTablePairs }, () => ({
      attackCardId: null,
      coverCardId: null,
    }))
  );

  // 3. Раздаем новые карты из колоды тем игрокам, у которых увеличилось число карт
  const { deckIncreases, currentPlayerDiff } = cardsTakenDetails;

  Object.entries(deckIncreases).forEach(([playerId, addedCount]) => {
    if (Number(playerId) === myIdRef.current) {
      // Для текущего игрока используем currentPlayerDiff (новые строки из data.cards)
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        currentPlayerDiff.forEach((cardStr) => {
          const deckIndex = updatedCards.findIndex(c => c.location === 'deck');
          if (deckIndex !== -1) {
            const { suit, rank, trumpFlag } = parseCard(cardStr);
            updatedCards[deckIndex] = {
              ...updatedCards[deckIndex],
              suit,
              rank,
              trumpFlag,
              location: 'player',
              playerId: myIdRef.current,
            };
          } else {
            console.warn(`[isBeaten] Нет карты в колоде для текущего игрока при обработке "${cardStr}"`);
          }
        });
        return updatedCards;
      });
    } else {
      // Для оппонентов просто переводим указанное количество карт из колоды в их руку
      const opponentId = Number(playerId);
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        for (let i = 0; i < addedCount; i++) {
          const deckIndex = updatedCards.findIndex(c => c.location === 'deck');
          if (deckIndex !== -1) {
            updatedCards[deckIndex] = {
              ...updatedCards[deckIndex],
              location: 'opponent',
              playerId: opponentId,
            };
          } else {
            console.warn(`[isBeaten] Нет карты в колоде для оппонента ${opponentId} на итерации ${i}`);
          }
        }
        return updatedCards;
      });
    }
  });

  // Сбрасываем флаг isBeaten и очищаем детали раздачи, чтобы не повторять операцию
  setIsBeaten(false);
  setCardsTakenDetails(null);
}, [isBeaten]);



  
  



  const handleTakeCards = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const eventObj = {
        player_id: myIdRef.current.toString(),
        type: 'defend_take',
        defending_card: null,
        attacking_card: null,
      };
      socket.send(JSON.stringify(eventObj));
    } else {
      console.error("Socket is not open, readyState:", socket?.readyState);
    }
  };

  const handleBeat = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const eventObj = {
        player_id: myIdRef.current.toString(),
        type: 'attack_pass',
        defending_card: null,
        attacking_card: null,
      };
      socket.send(JSON.stringify(eventObj));
    } else {
      console.error("Socket is not open, readyState:", socket?.readyState);
    }
  };


  const isTakeVisible =
  gameState.current?.data?.actions?.some((action) => action.type === 'defend_take') ||
  false;

  const isBeatVisible =
  gameState.current?.data?.actions?.some((action) => action.type === 'attack_pass') || false;



  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>
      <OpponentsContainer 
      numPlayers={numPlayers} 
      allOpponentCards={cards.filter((c) => c.location === 'opponent')} 
      opponents={opponents}
      />
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
