// GameBoard.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { captureFlipState, animateFlip, FlipState } from './animations/dealCards';
import { Card, Suit, Rank } from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer';
import Player from './Player';

import styles from './styles/GameBoard.module.css';
import { getCardStyle, tablePositions } from './position/cardPositioning';

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
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableCardIndices, setTableCardIndices] = useState<number[]>([]); // Индексы карт на столе
  const [revertCardIds, setRevertCardIds] = useState<string[]>([]); // ID карт, которые нужно вернуть

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
    if (!tableRef.current) return;
  
    const tableRect = tableRef.current.getBoundingClientRect();
  
    // Предполагаемые размеры карты (можно динамически получить)
    const cardWidth = 100; // пикселей
    const cardHeight = 150; // пикселей
  
    const isOverTable = (
      position.x + cardWidth > tableRect.left &&
      position.x < tableRect.right &&
      position.y + cardHeight > tableRect.top &&
      position.y < tableRect.bottom
    );
  
    if (isOverTable) {
      // Найти карту по ID
      const cardIndex = cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return;
  
      // Проверить, есть ли свободные позиции на столе
      if (tableCardIndices.length >= tablePositions.length) {
        console.log('Нет доступных позиций на столе.');
        return;
      }
  
      const tablePosIndex = tableCardIndices.length;
  
      // Получить позицию на столе
      const targetPos = tablePositions[tablePosIndex];
      if (!targetPos) {
        console.log('Нет доступных позиций на столе.');
        return;
      }
  
      // Обновить карту: изменить location на 'table' и установить tablePositionIndex
      setCards(prevCards => {
        const updatedCards = [...prevCards];
        updatedCards[cardIndex].location = 'table';
        updatedCards[cardIndex].tablePositionIndex = tablePosIndex;
        return updatedCards;
      });
  
      // Добавить индекс карты в массив tableCardIndices
      setTableCardIndices(prev => [...prev, cardIndex]);
    } else {
      // Не было размещения на столе, нужно вернуть карту обратно
      setRevertCardIds(prev => [...prev, cardId]);
    }
  };

  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');
  const tableCards = cards.filter((c) => c.location === 'table');

  console.log('tableCards', tableCards);

  return (
    <div className={styles.gameBoard}>
      {/* Зона стола */}
      <div
        ref={tableRef}
        className={styles.tableArea}
      >
        {/* Визуальное обозначение стола */}
        <div className={styles.tableBackground}></div>
      </div>

      {/* Все оппоненты (аватар + счётчик) */}
      <OpponentsContainer 
        numPlayers={numPlayers}
        allOpponentCards={opponentCards} 
      />

      {/* Сам игрок (кнопка Start + аватар + кол-во карт) */}
      <Player onStartGame={handleStartGame} cards={playerCards} />

      {/* Все карты (единым списком) */}
      {cards.map((card) => {
        const style = getCardStyle(card, cards, numPlayers);
        return (
          <div key={card.id} style={style}>
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
