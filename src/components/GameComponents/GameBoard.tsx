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
import { generateSlotsPositions } from './position/generateSlotsPositions';

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
  const gameBoardRef = useRef<HTMLDivElement>(null); // Изменено: основной реф для GameBoard
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableCardIndices, setTableCardIndices] = useState<number[]>([]); // Индексы карт на столе
  const [revertCardIds, setRevertCardIds] = useState<string[]>([]); // ID карт, которые нужно вернуть
  const [isTableActive, setIsTableActive] = useState<boolean>(false); // Для подсветки

  // Создание массива рефов для слотов
  const slotRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  // Обновляем позиции слотов при изменении количества карт на столе
  useEffect(() => {
    if (tableCardIndices.length > 0) {
      const newPositions = generateSlotsPositions(tableCardIndices.length);
      slotRefs.current = newPositions.map(() => React.createRef<HTMLDivElement>());
      console.log('Updated slot positions:', newPositions);
    }
  }, [tableCardIndices.length]);

  // Генерация колоды при первом рендере
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
  }, []);

  // Анимация Flip при изменении состояния карт
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
    }
  }, [cards]);

  // Функция раздачи карт
  const handleStartGame = () => {
    flipStateRef.current = captureFlipState();

    setCards((prev) => {
      const updated = [...prev];
      if (!updated.length) return updated;

      const lastIndex = updated.length - 1;
      const trumpCard = updated[lastIndex];
      trumpCard.location = 'trump';  // карта-козырь
      setTrumpSuit(trumpCard.suit);

      let deckPos = 0;
      const maxCardsForDeal = lastIndex; // оставили 1 карту под козырь
      const numOpponents = numPlayers - 1;

      // Функция "отдать карту игроку"
      const giveCardToPlayer = (i: number) => {
        updated[i].location = 'player';
        updated[i].seatIndex = undefined;
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

      return updated;
    });
  };

  // Функция обработки сброса карты на стол
  const handleCardDrop = (cardId: string, position: { x: number; y: number }) => {
    if (!gameBoardRef.current || !tableRef.current) return;

    const gameBoardRect = gameBoardRef.current.getBoundingClientRect();
    const tableRect = tableRef.current.getBoundingClientRect();

    // Предполагаемые размеры карты (соответствуют слоту)
    const cardWidth = 60; // пикселей
    const cardHeight = 85; // пикселей

    const isOverTable = (
      position.x + cardWidth > tableRect.left &&
      position.x < tableRect.right &&
      position.y + cardHeight > tableRect.top &&
      position.y < tableRect.bottom
    );

    console.log(`Card ${cardId} dropped at position:`, position);

    setIsTableActive(isOverTable);

    if (isOverTable) {
      // Найти карту по ID
      const cardIndex = cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return;

      // Проверить, есть ли свободные позиции на столе (максимум 6)
      if (tableCardIndices.length >= 6) {
        console.log('Нет доступных позиций на столе (максимум 6 карт).');
        return;
      }

      const tablePosIndex = tableCardIndices.length;

      // Получить позицию из глобальных tablePositions
      const pos = generateSlotsPositions(tableCardIndices.length + 1);
      const targetPos = pos[tablePosIndex];

      if (!targetPos) {
        console.log('Нет доступных слотов на столе.');
        return;
      }

      console.log(`Target position for card ${cardId}:`, targetPos);

      // Рассчитать конечную позицию относительно родителя `gameBoard`
      const relativeTop = (gameBoardRect.height * targetPos.top / 100) - cardHeight / 2;
      const relativeLeft = (gameBoardRect.width * targetPos.left / 100) - cardWidth / 2;

      console.log(`Calculated relative position for card ${cardId}: top ${relativeTop}, left ${relativeLeft}`);

      // Найти DOM-элемент карты (outer div)
      const element = document.querySelector(`[data-flip-id="${cardId}"]`) as HTMLElement;
      if (element) {
        // Анимировать карту к слоту
        gsap.to(element, {
          top: relativeTop,
          left: relativeLeft,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            // Обновить карту: изменить location на 'table' и установить tablePositionIndex
            setCards(prevCards => {
              const updatedCards = [...prevCards];
              updatedCards[cardIndex].location = 'table';
              updatedCards[cardIndex].tablePositionIndex = tablePosIndex;
              return updatedCards;
            });
  
            // Добавить индекс карты в массив tableCardIndices
            setTableCardIndices(prev => [...prev, cardIndex]);
  
            console.log(`Card ${cardId} placed on table slot ${tablePosIndex}`);
          }
        });
      }
    } else {
      // Не было размещения на столе, нужно вернуть карту обратно
      console.log(`Card ${cardId} not placed on table. Reverting.`);
      setRevertCardIds(prev => [...prev, cardId]);
    }
  };

  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  return (
    <div className={styles.gameBoard} ref={gameBoardRef}>
      {/* Визуальная область стола */}
      <TableArea 
        ref={tableRef}
        isActive={isTableActive}
      />

      {/* Все оппоненты (аватар + счётчик) */}
      <OpponentsContainer 
        numPlayers={numPlayers}
        allOpponentCards={opponentCards} 
      />

      {/* Сам игрок (кнопка Start + аватар + кол-во карт) */}
      <Player onStartGame={handleStartGame} cards={playerCards} />

      {/* Слоты для карт на столе */}
      {generateSlotsPositions(tableCardIndices.length).map((pos, index) => (
        <div
          key={index}
          ref={slotRefs.current[index]}
          className={styles.slot}
          style={{
            position: 'absolute',
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            width: '50px',
            height: '70px',
            pointerEvents: 'none', // Чтобы слоты не блокировали события
          }}
        />
      ))}

      {/* Все карты (единым списком) */}
      {cards.map((card) => {
        const style = getCardStyle(card, cards, numPlayers, tableCardIndices.length); // Передаём tableCardIndices.length
        return (
          <div 
            key={card.id} 
            style={style} 
            data-flip-id={card.id} // Присваиваем уникальный ID внешнему div
          >
            <CardItem 
              card={card} 
              trumpSuit={trumpSuit} 
              onCardDrop={handleCardDrop}
              shouldRevert={revertCardIds.includes(card.id)}
              onRevertComplete={() => setRevertCardIds(prev => prev.filter(id => id !== card.id))}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
