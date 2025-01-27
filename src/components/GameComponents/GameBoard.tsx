// GameBoard.tsx
import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { captureFlipState, animateFlip } from './animations/dealCards';
import { Card, Suit, Rank } from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';
import styles from './styles/GameBoard.module.css';
import { getCardStyle, getTrumpCardStyle } from './position/cardPositioning';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';
import { FlipState as FlipStateType } from './animations/dealCards';
import { SLOT_POSITIONS } from './position/fixedSlotPositions';

gsap.registerPlugin(Draggable, Flip);

interface GameBoardProps {
  numPlayers: number;
}

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

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
  // Перемешивание
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const DISTANCE_THRESHOLD = 200; // Пороговое расстояние в пикселях

const GameBoard: React.FC<GameBoardProps> = ({ numPlayers }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
  const [trumpCardId, setTrumpCardId] = useState<string | null>(null);
  

  const flipStateRef = useRef<FlipStateType | null>(null);
  const newFlipStateRef = useRef<FlipStateType | null>(null);
  
  const gameBoardRef = useRef<HTMLDivElement>(null);
  // Удалены tableRef и isTableActive
  const [tableSlots, setTableSlots] = useState<(string | null)[]>(() =>
    Array(SLOT_POSITIONS.length).fill(null)
  );

  // Реф для хранения Draggable-инстансов
  const draggableRefs = useRef<Record<string, Draggable>>({});

  // Реф для хранения актуального состояния tableSlots
  const tableSlotsRef = useRef<(string | null)[]>(tableSlots);

  // Обновляем tableSlotsRef при изменении tableSlots
  useEffect(() => {
    tableSlotsRef.current = tableSlots;
  }, [tableSlots]);

  // Генерация колоды при первом рендере
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
    console.log('Initial deck created:', initialDeck);
  }, []);

  // Вычисляем первый свободный слот
  const activeSlotIndex = useMemo(() => {
    return tableSlots.findIndex((slot) => slot === null);
  }, [tableSlots]);

  // Логирование изменения активного слота
  useEffect(() => {
    if (activeSlotIndex !== -1) {
      console.log(`Текущий активный слот: ${activeSlotIndex}`);
    } else {
      console.log('Нет доступных слотов на столе.');
    }
  }, [activeSlotIndex]);

  // Анимация Flip при изменении состояния карт
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
        console.log('Flip animation completed');
      });
    }
  }, [cards]);

  // Функция раздачи карт
  const handleStartGame = () => {
    console.log('Game started');
    flipStateRef.current = captureFlipState();

    console.log(flipStateRef.current);

    setCards((prev) => {
      const updated = [...prev];
      if (!updated.length) return updated;

      const lastIndex = updated.length - 1;
      const trumpCard = updated[lastIndex];

      setTrumpSuit(trumpCard.suit);
      setTrumpCardId(trumpCard.id);
      console.log(`Trump card set: ${trumpCard.id}, Suit: ${trumpCard.suit}`);

      let deckPos = 0;
      const maxCardsForDeal = updated.length; // оставили 1 карту под козырь
      const numOpponents = numPlayers - 1;

      // Функция "отдать карту игроку"
      const giveCardToPlayer = (i: number) => {
        updated[i].location = 'player';
      };
      // Функция "отдать карту конкретному оппоненту seatIndex"
      const giveCardToOpponent = (i: number, seat: number) => {
        updated[i].location = 'opponent';
        updated[i].seatIndex = seat;
      };

      const cardsPerPlayer = 6;

      // Цикл для раздачи карт циклически между игроком и оппонентами
      for (let i = 0; i < cardsPerPlayer; i++) {
        if (deckPos >= maxCardsForDeal) break;

        // Раздаём одну карту игроку
        giveCardToPlayer(deckPos++);

        // Раздаём по одной карте каждому оппоненту
        for (let seat = 0; seat < numOpponents; seat++) {
          if (deckPos >= maxCardsForDeal) break;
          giveCardToOpponent(deckPos++, seat);
        }
      }

      console.log('Cards after dealing:', updated);
      return updated;
    });
  };

  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  useEffect(() => {
    playerCards.forEach((card) => {
      if (draggableRefs.current[card.id]) {
        // Уже инициализировано
        return;
      }

      const element = document.querySelector(`[data-flip-id="${card.id}"]`);
      // console.log('element:', element);
      if (element) {
        const draggableInstance = Draggable.create(element, {
          type: 'x,y',
          onPress: function () {
            // Захват исходного состояния при начале перетаскивания
            newFlipStateRef.current = Flip.getState(element, {
              props: 'transform, top, left, zIndex',
            });
            console.log('Исходное состояние:', newFlipStateRef.current);
            console.log(`Начато перетаскивание карты ${card.id}`);
          },
          onDragEnd: function () {
            console.log(`Перетаскивание завершено для карты ${card.id}`);

            // Захват нового состояния Flip непосредственно здесь
            flipStateRef.current = Flip.getState(element, {
              props: 'transform, top, left, zIndex',
            });
            console.log('Новое состояние Flip после перетаскивания:', flipStateRef.current);

            const rect = element.getBoundingClientRect();

            // Получаем позицию игрового поля
            if (!gameBoardRef.current) {
              console.error('gameBoardRef отсутствует');
              return;
            }
            const gameBoardRect = gameBoardRef.current.getBoundingClientRect();

            // Определяем центр карты
            const cardCenter = {
              x: rect.left + rect.width / 2,
              y: rect.top + rect.height / 2,
            };

            // Используем tableSlotsRef.current для получения актуального первого свободного слота
            const freeSlotIndex = tableSlotsRef.current.findIndex((slot) => slot === null);
            if (freeSlotIndex === -1) {
              console.warn('Нет доступных слотов на столе.');
              // Возврат карты на исходную позицию
              if (newFlipStateRef.current) {
                console.log(`Возврат карты ${card.id} на исходную позицию`);
                Flip.to(newFlipStateRef.current, {
                  duration: 0.8,
                  ease: 'power4.out',
                  absolute: true,
                  zIndex: 100,
                  onComplete: () => {
                    console.log(`Возврат завершен для карты ${card.id}`);
                  },
                });
              }
              return;
            }

            const targetPos = SLOT_POSITIONS[freeSlotIndex];
            if (!targetPos) {
              console.error('Целевая позиция для слота не найдена.');
              // Возврат карты на исходную позицию
              if (newFlipStateRef.current) {
                Flip.to(newFlipStateRef.current, {
                  duration: 0.8,
                  ease: 'power4.out',
                  absolute: true,
                  zIndex: 100,
                  onComplete: () => {
                    console.log(`Возврат завершен для карты ${card.id}`);
                  },
                });
              }
              return;
            }

            // Рассчитываем абсолютные пиксельные позиции слота
            const slotPixelPosition = {
              x:
                gameBoardRect.left +
                (gameBoardRect.width * targetPos.left) / 100 +
                25, // 25 - половина ширины слота (50px / 2)
              y:
                gameBoardRect.top +
                (gameBoardRect.height * targetPos.top) / 100 +
                35, // 35 - половина высоты слота (70px / 2)
            };

            // Рассчитываем расстояние между центрами карты и слота
            const distance = Math.hypot(
              cardCenter.x - slotPixelPosition.x,
              cardCenter.y - slotPixelPosition.y
            );

            console.log(`Расстояние до активного слота ${freeSlotIndex}: ${distance}px`);

            if (distance <= DISTANCE_THRESHOLD) {
              // Если расстояние меньше порога, размещаем карту в слоте
              console.log(
                `Карта ${card.id} близка к активному слоту ${freeSlotIndex}. Размещаем в слоту.`
              );

              // Передаём newFlipState и slotIndex в функцию обработки
              handleCardDropOnTable(card.id, flipStateRef.current, freeSlotIndex);
            } else {
              // Иначе возвращаем карту на исходную позицию
              console.log(
                `Карта ${card.id} слишком далеко от активного слота ${freeSlotIndex}. Возврат на исходную позицию.`
              );
              if (newFlipStateRef.current) {
                Flip.to(newFlipStateRef.current, {
                  duration: 0.8,
                  ease: 'power4.out',
                  absolute: true,
                  zIndex: 100,
                  onComplete: () => {
                    console.log(`Возврат завершен для карты ${card.id}`);
                  },
                });
              }
            }
          },
        })[0];

        draggableRefs.current[card.id] = draggableInstance;
      } else {
        console.error(`Element для карты ${card.id} не найден`);
      }
    });

    // Очистка Draggable-инстансов для карт, которые больше не являются игроком
    return () => {
      Object.keys(draggableRefs.current).forEach((cardId) => {
        const card = cards.find((c) => c.id === cardId);
        if (card && card.location !== 'player') {
          draggableRefs.current[cardId].kill();
          delete draggableRefs.current[cardId];
          console.log(`Draggable killed for card ${cardId}`);
        }
      });
    };
  }, [playerCards, cards]); 

  // Обновлённая функция обработки сброса карты на слот с анимацией Flip
  const handleCardDropOnTable = (
    cardId: string,
    flipStateRef: FlipStateType,
    slotIndex: number
  ) => {
    if (!gameBoardRef.current) {
      console.error('GameBoard ссылка отсутствует');
      return;
    }

    console.log(
      `Обработка сброса карты ${cardId} в слот ${slotIndex} с новым состоянием Flip`
    );

    // Обновление состояния карты: перемещение на стол и назначение индекса слота
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const cardIndex = updatedCards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) {
        console.error(`Карта с ID ${cardId} не найдена`);
        return updatedCards;
      }
      updatedCards[cardIndex].location = 'table';
      updatedCards[cardIndex].tablePositionIndex = slotIndex;
      console.log(`Карта ${cardId} перемещена в слот ${slotIndex} на столе`);
      return updatedCards;
    });

    // Назначение карты в слот
    setTableSlots((prevSlots) => {
      const updatedSlots = [...prevSlots];
      updatedSlots[slotIndex] = cardId;
      console.log(`Слот ${slotIndex} на столе теперь содержит карту ${cardId}`);

      // Логирование новой активной позиции после занятости слота
      const newActiveSlot = updatedSlots.findIndex((slot) => slot === null);
      if (newActiveSlot !== -1) {
        console.log(`Новый активный слот: ${newActiveSlot}`);
      } else {
        console.log('Нет доступных слотов на столе после размещения карты.');
      }

      return updatedSlots;
    });

    // Анимация карты с использованием Flip
    Flip.from(flipStateRef, {
      duration: 0.8,
      ease: 'power2.out',
      absolute: true,
      scale: true,
      rotate: 1,
      onComplete: () => {
        console.log(`Анимация Flip завершена для карты ${cardId}`);
      },
    });
  };

  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>

      <OpponentsContainer numPlayers={numPlayers} allOpponentCards={opponentCards} />
      <Player onStartGame={handleStartGame} cards={playerCards} />

      {SLOT_POSITIONS.map((pos, index) => (
        <div
          key={index}
          className={styles.slot}
          style={{
            position: 'absolute',
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            width: '50px',
            height: '70px',
            pointerEvents: 'none', // Чтобы слоты не блокировали события
            backgroundColor:
              tableSlots[index] === null
                ? 'rgba(255, 0, 0, 0.3)' // Красный для активного слота (первый свободный)
                : 'rgba(0, 255, 0, 0.2)', // Зеленый для занятых слотов
            border:
              tableSlots[index] === null
                ? '2px solid red' // Толстая граница для активного слота
                : '1px dashed green', // Пунктирная граница для занятых слотов
          }}
        />
      ))}

      {/* Все карты (единым списком) */}
      {cards.map((card) => {
        let style;
        if (card.id === trumpCardId && card.location === 'deck') {
          // Если есть функция вида getTrumpCardStyle — вызываем её
          style = getTrumpCardStyle(card, cards, numPlayers);
        } else {
          style = getCardStyle(card, cards, numPlayers);
        }

        const isFaceUp =
          // Если это карта в руке игрока
          card.location === 'player' ||
          // Или карта лежит на столе
          card.location === 'table' ||
          // Или это именно козырная карта, которая ещё в колоде
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
