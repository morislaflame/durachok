import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { captureFlipState, animateFlip } from './animations/dealCards';
import { Card, Suit, Rank, TablePair } from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';
import styles from './styles/GameBoard.module.css';
import { getCardStyle, getTrumpCardStyle } from './position/cardPositioning';
import { TABLE_PAIRS_POSITIONS } from './position/tablePairsPositions';
import { canCoverCard } from './utils/canCoverCard';
import { getSuitClass, getSuitSymbol } from './utils/suitSymbols';

gsap.registerPlugin(Draggable, Flip);

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Максимум пар на столе (6 атак — это чаще всего потолок для подкидного)
const MAX_TABLE_PAIRS = 6;
const DISTANCE_THRESHOLD = 200; // макс. расстояние, при котором «слипаем» карту со слотом

/** Создаём и перемешиваем колоду */
function createAllDeck(): Card[] {
  const deck: Card[] = [];
  let idCount = 0;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: 'card_' + idCount++,
        suit,
        rank,
        location: 'deck',
      });
    }
  }
  // Перемешивание Фишера–Йетса
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

interface GameBoardProps {
  numPlayers: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ numPlayers }) => {
  // ==== Состояния ====
  const [cards, setCards] = useState<Card[]>([]);
  const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
  const [trumpCardId, setTrumpCardId] = useState<string | null>(null);

  // Пары (атака/крышка), изначально все свободны
  const [tablePairs, setTablePairs] = useState<TablePair[]>(
    () =>
      Array.from({ length: MAX_TABLE_PAIRS }, () => ({
        attackCardId: null,
        coverCardId: null,
      }))
  );

  // Простая логика: сейчас ход «attack» или «defend»
  const [currentTurnRole, setCurrentTurnRole] = useState<'attack' | 'defend'>('attack');

  // refs для анимации
  const flipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const newFlipStateRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null);
  const discardCardsRef = useRef<ReturnType<typeof Flip.getState> | null>(null);

  // Draggable-инстансы, храним по ключу cardId
  const draggableRefs = useRef<Record<string, Draggable>>({});

  // ref для "роли", чтобы не пересоздавать Draggable при её смене
  const roleRef = useRef<'attack' | 'defend'>('attack');
  useEffect(() => {
    roleRef.current = currentTurnRole;
  }, [currentTurnRole]);

  // ==== Инициализация колоды ====
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
  }, []);

  // ==== Flip-анимация при изменении массива cards ====
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
      console.log('animateFlip');
    }
  }, [cards]);

  // ==== Кнопка StartGame (раздача) ====
  const handleStartGame = () => {
    console.log('Game started');
    flipStateRef.current = captureFlipState();

    setCards((prev) => {
      const updated = [...prev];
      if (!updated.length) return updated;

      // Последняя карта — козырь
      const lastIndex = updated.length - 1;
      const trumpCard = updated[lastIndex];
      setTrumpSuit(trumpCard.suit);
      setTrumpCardId(trumpCard.id);

      // Раздаём
      const maxCardsForDeal = updated.length;
      const numOpponents = numPlayers - 1;
      let deckPos = 0;
      const cardsPerPlayer = 6;

      const giveCardToPlayer = (i: number) => {
        updated[i].location = 'player';
      };
      const giveCardToOpponent = (i: number, seat: number) => {
        updated[i].location = 'opponent';
        updated[i].seatIndex = seat;
      };

      for (let i = 0; i < cardsPerPlayer; i++) {
        if (deckPos >= maxCardsForDeal) break;
        giveCardToPlayer(deckPos++);
        for (let seat = 0; seat < numOpponents; seat++) {
          if (deckPos >= maxCardsForDeal) break;
          giveCardToOpponent(deckPos++, seat);
        }
      }

      return updated;
    });
  };

  // ==== Фильтруем карты игрока и оппонентов ====
  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  // ==== Инициализация Draggable для карт в руке игрока ====
  useEffect(() => {
    playerCards.forEach((card) => {
      // Если уже есть Draggable для этой карты - пропускаем
      if (draggableRefs.current[card.id]) return;

      const el = document.querySelector(`[data-flip-id="${card.id}"]`) as HTMLElement | null;
      if (!el) return;

      const draggable = Draggable.create(el, {
        type: 'x,y',
        onPress: () => {
          // Исходное состояние для Flip
          newFlipStateRef.current = Flip.getState(el, {
            props: 'transform, top, left, zIndex',
          });
        },
        onDragEnd: () => {
          // Новое состояние
          flipStateRef.current = Flip.getState(el, {
            props: 'transform, top, left, zIndex',
          });
          handlePlayerCardDrop(card.id, flipStateRef.current!);
        },
      })[0];

      draggableRefs.current[card.id] = draggable;
    });

    // Если карта перестала быть у игрока, убиваем Draggable
    return () => {
      Object.keys(draggableRefs.current).forEach((cardId) => {
        const c = cards.find((cc) => cc.id === cardId);
        if (c && c.location !== 'player') {
          draggableRefs.current[cardId].kill();
          delete draggableRefs.current[cardId];
        }
      });
    };
  }, [playerCards, cards]);

  // ==== Обработка окончания перетаскивания ====
  function handlePlayerCardDrop(cardId: string, flipState: ReturnType<typeof Flip.getState>) {
    if (!gameBoardRef.current || !newFlipStateRef.current) return;

    const el = document.querySelector(`[data-flip-id="${cardId}"]`) as HTMLElement | null;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gameRect = gameBoardRef.current.getBoundingClientRect();
    // Центр карты
    const cardCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const actualRole = roleRef.current;
    console.log(`actualRole: ${actualRole}`);

    if (actualRole === 'attack') {
      // Ищем первую свободную пару (attackCardId == null)
      const freeIndex = tablePairs.findIndex((p) => p.attackCardId === null);
      if (freeIndex === -1) {
        console.log('Нет свободных слотов для атаки');
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      // Проверяем расстояние до attack-слота
      const { top, left } = TABLE_PAIRS_POSITIONS[freeIndex].attack;
      const slotPos = {
        x: gameRect.left + (gameRect.width * left) / 100,
        y: gameRect.top + (gameRect.height * top) / 100,
      };
      const dist = Math.hypot(cardCenter.x - slotPos.x, cardCenter.y - slotPos.y);
      if (dist > DISTANCE_THRESHOLD) {
        console.log('Слишком далеко до attack-слота');
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      // Размещаем карту как "attack"
      placeAttackCard(cardId, freeIndex, flipState);

    } else {
      // Ход defend
      let foundIndex: number | null = null;
      for (let i = 0; i < tablePairs.length; i++) {
        const pair = tablePairs[i];
        if (!pair.attackCardId || pair.coverCardId) continue; // занята или нет карты атаки

        // Коорд. cover-слота
        const { top, left } = TABLE_PAIRS_POSITIONS[i].cover;
        const slotPos = {
          x: gameRect.left + (gameRect.width * left) / 100,
          y: gameRect.top + (gameRect.height * top) / 100,
        };
        const dist = Math.hypot(cardCenter.x - slotPos.x, cardCenter.y - slotPos.y);
        if (dist <= DISTANCE_THRESHOLD) {
          foundIndex = i;
          break;
        }
      }
      if (foundIndex === null) {
        console.log('Нет подходящего cover-слота рядом');
        revertCard(cardId, newFlipStateRef.current);
        return;
      }

      // Проверяем, бьёт ли карта
      const attackId = tablePairs[foundIndex].attackCardId;
      if (!attackId) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      const attackCard = cards.find((c) => c.id === attackId);
      const coverCard = cards.find((c) => c.id === cardId);
      if (!attackCard || !coverCard) {
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      if (!canCoverCard(attackCard, coverCard, trumpSuit)) {
        console.log('Карта не бьёт атакующую');
        revertCard(cardId, newFlipStateRef.current);
        return;
      }
      // Всё ок, кладём как cover
      placeCoverCard(cardId, foundIndex, flipState);
    }
  }

  /** Положить карту как "атака" в указанную пару */
  function placeAttackCard(
    cardId: string,
    pairIndex: number,
    flipState: ReturnType<typeof Flip.getState>
  ) {
    setTablePairs((prev) => {
      const copy = [...prev];
      copy[pairIndex].attackCardId = cardId;
      return copy;
    });
    setCards((prev) => {
      const arr = [...prev];
      const c = arr.find((x) => x.id === cardId);
      if (c) {
        c.location = 'table';
        c.tablePairIndex = pairIndex;
        c.tableRole = 'attack';
      }
      return arr;
    });

    Flip.from(flipState, {
      duration: 0.8,
      ease: 'power2.out',
      absolute: true,
      scale: true,
    });
  }

  /** Положить карту как "cover" */
  function placeCoverCard(
    cardId: string,
    pairIndex: number,
    flipState: ReturnType<typeof Flip.getState>
  ) {
    setTablePairs((prev) => {
      const copy = [...prev];
      copy[pairIndex].coverCardId = cardId;
      return copy;
    });
    setCards((prev) => {
      const arr = [...prev];
      const c = arr.find((x) => x.id === cardId);
      if (c) {
        c.location = 'table';
        c.tablePairIndex = pairIndex;
        c.tableRole = 'cover';
      }
      return arr;
    });

    Flip.from(flipState, {
      duration: 0.8,
      ease: 'power2.out',
      absolute: true,
      scale: true,
    });
  }

  /** Откат карты назад, если не подошла */
  function revertCard(cardId: string, oldState: ReturnType<typeof Flip.getState>) {
    console.log(`Возвращаем карту ${cardId}`);
    Flip.to(oldState, {
      duration: 0.8,
      ease: 'power4.out',
      absolute: true,
      zIndex: 100,
    });
  }

  // ==== Логика для кнопки «Бито» ====
  // Условие: хотя бы одна пара должна быть атакована,
  // и при этом все атакованные пары — покрыты (coverCardId != null).
  const hasAtLeastOneAttack = tablePairs.some((p) => p.attackCardId !== null);
  const allAttacksCovered = tablePairs.every(
    (p) => p.attackCardId === null || p.coverCardId !== null
  );
  const isBeatVisible = hasAtLeastOneAttack && allAttacksCovered;

// ...
// При нажатии «Бито» — все *покрытые* пары убираем в "discard"
const handleBeat = () => {
  const coveredCardIds: string[] = [];
  tablePairs.forEach((pair) => {
    if (pair.attackCardId && pair.coverCardId) {
      coveredCardIds.push(pair.attackCardId, pair.coverCardId);
    }
  });
  const elements: HTMLElement[] = [];
  coveredCardIds.forEach((id) => {
    const el = document.querySelector(`[data-flip-id="${id}"]`) as HTMLElement | null;
    if (el) elements.push(el);
  });

  // Захват «старых» координат
  discardCardsRef.current = Flip.getState(elements, {
    props: 'transform, top, left, zIndex',
  });

  // Переводим карты в discard
  setCards((prev) => {
    const newArr = [...prev];
    tablePairs.forEach((pair) => {
      const { attackCardId, coverCardId } = pair;
      if (attackCardId && coverCardId) {
        const attackCard = newArr.find((c) => c.id === attackCardId);
        const coverCard = newArr.find((c) => c.id === coverCardId);
        if (attackCard) attackCard.location = 'discard';
        if (coverCard) coverCard.location = 'discard';
      }
    });
    return newArr;
  });
  // Очищаем пары...
  setTablePairs((prev) => {
    return prev.map((p) => {
      if (p.attackCardId && p.coverCardId) {
        return { attackCardId: null, coverCardId: null };
      }
      return p;
    });
  });
};

useLayoutEffect(() => {
  if (discardCardsRef.current) {
    Flip.from(discardCardsRef.current, {
      duration: 1,
      ease: 'power2.out',
      absolute: true,
      scale: true,
    });
    discardCardsRef.current = null;
  }
}, [cards]);




  // ==== Рендер ====
  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>

      {/* Контейнер оппонентов */}
      <OpponentsContainer numPlayers={numPlayers} allOpponentCards={opponentCards} />

      {/* Игрок (кнопка старт, карты, кнопка "Бито") */}
      <Player
        onStartGame={handleStartGame}
        cards={playerCards}
        onBeat={handleBeat}
        isBeatVisible={isBeatVisible}
      />

      {/* Тестовые кнопки: смена роли хода */}
      <div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
        <p>Current role: {currentTurnRole}</p>
        <button onClick={() => setCurrentTurnRole('attack')}>Attack</button>
        <button onClick={() => setCurrentTurnRole('defend')}>Defend</button>
      </div>

      {/* Отрисовка слотов-пар (attack/cover) */}
      {tablePairs.map((pair, i) => {
        const pos = TABLE_PAIRS_POSITIONS[i];
        if (!pos) return null;
        return (
          <React.Fragment key={i}>
            {/* Слот "attack" */}
            <div
              style={{
                position: 'absolute',
                top: `${pos.attack.top}%`,
                left: `${pos.attack.left}%`,
                width: '50px',
                height: '70px',
                backgroundColor: pair.attackCardId
                  ? 'rgba(0,255,0,0.2)'
                  : 'rgba(255,0,0,0.3)',
                border: pair.attackCardId
                  ? '1px dashed green'
                  : '2px solid red',
                pointerEvents: 'none',
              }}
            />
            {/* Слот "cover" */}
            <div
              style={{
                position: 'absolute',
                top: `${pos.cover.top}%`,
                left: `${pos.cover.left}%`,
                width: '50px',
                height: '70px',
                backgroundColor: pair.coverCardId
                  ? 'rgba(0,255,0,0.2)'
                  : 'rgba(255,0,0,0.3)',
                border: pair.coverCardId
                  ? '1px dashed green'
                  : '2px solid red',
                pointerEvents: 'none',
              }}
            />
          </React.Fragment>
        );
      })}

      {/* Индикатор масти козыря */}
      {trumpSuit && (
        <div
          className={styles.trumpIndicator}
          style={{ color: getSuitClass(trumpSuit) }}
        >
          {getSuitSymbol(trumpSuit)}
        </div>
      )}

      {/* Все карты */}
      {cards.map((card) => {
        let style: React.CSSProperties;
        if (card.id === trumpCardId && card.location === 'deck') {
          style = getTrumpCardStyle();
        } else {
          style = getCardStyle(card, cards, numPlayers);
        }

        // Открываем карту, если у игрока или на столе (или это козырная)
        const isFaceUp =
          card.location === 'player' ||
          card.location === 'table' ||
          (card.id === trumpCardId && card.location === 'deck');

        return (
          <CardItem
            key={card.id}
            card={card}
            trumpSuit={trumpSuit}
            style={style}
            isDraggable={card.location === 'player'}
            isFaceUp={isFaceUp}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;
