// GameBoard.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { captureFlipState, animateFlip, FlipState } from './animations/dealCards';
import { Card, Suit, Rank } from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';
import TableArea from './TableArea';
import styles from './styles/GameBoard.module.css';
import { getCardStyle } from './position/cardPositioning';
import gsap from 'gsap';
import { SLOT_POSITIONS } from './position/fixedSlotPositions';

interface GameBoardProps {
  /** Общее кол-во игроков за столом (1 - это сам пользователь + (numPlayers - 1) оппонентов). */
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
        id: 'card_' + (idCount++),
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

const GameBoard: React.FC<GameBoardProps> = ({ numPlayers }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);

  const flipStateRef = useRef<FlipState | null>(null);
  const gameBoardRef = useRef<HTMLDivElement>(null); // Основной реф для GameBoard
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSlots, setTableSlots] = useState<(string | null)[]>(() =>
    Array(SLOT_POSITIONS.length).fill(null)
  ); // Состояние слотов на столе
  const [revertCardIds, setRevertCardIds] = useState<string[]>([]); // ID карт, которые нужно вернуть
  const [isTableActive, setIsTableActive] = useState<boolean>(false); // Для подсветки

  // Генерация колоды при первом рендере
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
    console.log('Initial deck created:', initialDeck);
  }, []);

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

    setCards((prev) => {
      const updated = [...prev];
      if (!updated.length) return updated;

      const lastIndex = updated.length - 1;
      const trumpCard = updated[lastIndex];
      trumpCard.location = 'trump'; // карта-козырь
      setTrumpSuit(trumpCard.suit);
      console.log(`Trump card set: ${trumpCard.id}, Suit: ${trumpCard.suit}`);

      let deckPos = 0;
      const maxCardsForDeal = lastIndex; // оставили 1 карту под козырь
      const numOpponents = numPlayers - 1;

      // Функция "отдать карту игроку"
      const giveCardToPlayer = (i: number) => {
        updated[i].location = 'player';
        updated[i].seatIndex = undefined;
        console.log(`Card ${updated[i].id} given to player`);
      };
      // Функция "отдать карту конкретному оппоненту seatIndex"
      const giveCardToOpponent = (i: number, seat: number) => {
        updated[i].location = 'opponent';
        updated[i].seatIndex = seat;
        console.log(`Card ${updated[i].id} given to opponent seat ${seat}`);
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

  // Функция обработки сброса карты на стол
  const handleCardDrop = (cardId: string, position: { x: number; y: number }) => {
    console.log(`handleCardDrop called for card ${cardId} at position:`, position);
  
    if (!gameBoardRef.current || !tableRef.current) {
      console.error('GameBoard or Table reference is missing');
      return;
    }
  
    const gameBoardRect = gameBoardRef.current.getBoundingClientRect();
    const tableRect = tableRef.current.getBoundingClientRect();
  
    // Предполагаемые размеры карты (соответствуют слоту)
    const cardWidth = 60; // пикселей
    const cardHeight = 85; // пикселей
  
    const isOverTable =
      position.x + cardWidth > tableRect.left &&
      position.x < tableRect.right &&
      position.y + cardHeight > tableRect.top &&
      position.y < tableRect.bottom;
  
    console.log(`Card ${cardId} dropped over table:`, isOverTable);
  
    setIsTableActive(isOverTable);
  
    if (isOverTable) {
      // Найти карту по ID
      const cardIndex = cards.findIndex((c) => c.id === cardId);
      if (cardIndex === -1) {
        console.error(`Card with ID ${cardId} not found`);
        return;
      }
  
      // Найти первый свободный слот
      const freeSlotIndex = tableSlots.findIndex((slot) => slot === null);
      if (freeSlotIndex === -1) {
        console.warn('Нет доступных позиций на столе (максимум 6 карт).');
        return;
      }
  
      const targetPos = SLOT_POSITIONS[freeSlotIndex];
  
      if (!targetPos) {
        console.error('Нет доступных слотов на столе.');
        return;
      }
  
      console.log(`Target position for card ${cardId}:`, targetPos);
  
      // Рассчитать конечную позицию относительно родителя `gameBoard`
      const targetTop = (gameBoardRect.height * targetPos.top) / 100 - cardHeight / 2;
      const targetLeft = (gameBoardRect.width * targetPos.left) / 100 - cardWidth / 2;
  
      console.log(`Calculated target position for card ${cardId}: top ${targetTop}, left ${targetLeft}`);
  
      // Найти DOM-элемент карты (outer div)
      const element = document.querySelector(`[data-flip-id="${cardId}"]`) as HTMLElement;
      if (element) {
        // Получить текущие позиции
        const currentRect = element.getBoundingClientRect();
        const currentTop = currentRect.top - gameBoardRect.top;
        const currentLeft = currentRect.left - gameBoardRect.left;
  
        // Рассчитать разницу для анимации
        const deltaX = targetLeft - currentLeft;
        const deltaY = targetTop - currentTop;
  
        console.log(`Animating card ${cardId}: deltaX ${deltaX}, deltaY ${deltaY}`);
  
        // Анимировать карту к слоту с использованием x и y
        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          duration: 0.5,
          ease: 'power2.out',
          onComplete: () => {
            console.log(`Animation completed for card ${cardId}`);
            // Обновить карту: изменить location на 'table' и установить tablePositionIndex
            setCards((prevCards) => {
              const updatedCards = [...prevCards];
              updatedCards[cardIndex].location = 'table';
              updatedCards[cardIndex].tablePositionIndex = freeSlotIndex;
              console.log(`Card ${cardId} location updated to table at slot index ${freeSlotIndex}`);
              return updatedCards;
            });
  
            // Обновить состояние слотов, присвоив карту слоту
            setTableSlots((prevSlots) => {
              const updatedSlots = [...prevSlots];
              updatedSlots[freeSlotIndex] = cardId;
              console.log(`Card ${cardId} placed on table slot ${freeSlotIndex}`);
              return updatedSlots;
            });
          },
        });
      } else {
        console.error(`Element for card ${cardId} not found`);
      }
    } else {
      // Не было размещения на столе, нужно вернуть карту обратно
      console.log(`Card ${cardId} not placed on table. Reverting.`);
      setRevertCardIds((prev) => [...prev, cardId]);
    }
  };

  // Обработчик завершения возврата карты
  const handleRevertComplete = () => {
    // Можно добавить дополнительную логику, если необходимо
  };

  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>
      {/* Визуальная область стола */}
      <TableArea ref={tableRef} isActive={isTableActive} />

      {/* Все оппоненты (аватар + счётчик) */}
      <OpponentsContainer numPlayers={numPlayers} allOpponentCards={opponentCards} />

      {/* Сам игрок (кнопка Start + аватар + кол-во карт) */}
      <Player onStartGame={handleStartGame} cards={playerCards} />

      {/* Слоты для карт на столе */}
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
            backgroundColor: 'rgba(0, 255, 0, 0.2)', // Добавлено для визуализации слотов
            border: '1px dashed green', // Добавлено для визуализации слотов
          }}
        />
      ))}

      {/* Все карты (единым списком) */}
      {cards.map((card) => {
        const style = getCardStyle(card, cards, numPlayers, SLOT_POSITIONS.length);
        return (
          <div key={card.id} style={style} data-flip-id={card.id}>
            <CardItem
              card={card}
              trumpSuit={trumpSuit}
              onCardDrop={handleCardDrop}
              shouldRevert={revertCardIds.includes(card.id)}
              onRevertComplete={handleRevertComplete}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
