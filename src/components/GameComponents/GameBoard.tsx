// GameBoard.tsx
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { captureFlipState, animateFlip, FlipState } from './animations/dealCards';
import { Card, Suit, Rank } from '../../types/types';
import CardItem from './CardItem';
import OpponentsContainer from './OpponentsContainer'; 
import Player from './Player';

import styles from './styles/GameBoard.module.css';
import { getCardStyle } from './position/cardPositioning';

interface GameBoardProps {
  /** Общее кол-во игроков за столом (1 - это сам user, + (numPlayers - 1) оппонентов). */
  numPlayers: number;
}

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/** Генерация и перемешивание колоды */
function createAllDeck(): Card[] {
  const deck: Card[] = [];
  let idCount = 0;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: 'card_' + (idCount++),
        suit,
        rank,
        location: 'deck', // Изначально все в колоде
      });
    }
  }
  // Перемешаем
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

  // 1) При первом рендере — создаём колоду
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
  }, []);

  // 2) Когда `cards` меняется, если есть сохранённое flipState — запускаем анимацию
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
    }
  }, [cards]);

  // 3) Нажатие "Start Game":
  //    - Снимаем Flip-состояние
  //    - Определяем козырь (нижняя карта в колоде) => переводим её в location='trump'
  //    - Раздаём по 6 карт игроку (location='player') и оставшимся
  //      (location='opponent' + seatIndex=?).
  const handleStartGame = () => {
    flipStateRef.current = captureFlipState();

    setCards((prev) => {
      const updated = [...prev];
      if (updated.length === 0) return updated;

      // Найдём последнюю карту, сделаем её trump
      const lastIndex = updated.length - 1;
      const trumpCard = updated[lastIndex];
      trumpCard.location = 'trump';
      setTrumpSuit(trumpCard.suit);

      // Раздаём

      // 1) 6 карт игроку (если их хватает)
      let deckPos = 0; 
      const maxCardsForDeal = lastIndex; // -1 карта под козырь

      const giveCardToPlayer = (cardIndex: number) => {
        updated[cardIndex].location = 'player';
        updated[cardIndex].seatIndex = undefined; // у игрока seatIndex не нужен
      };

      const giveCardToOpponent = (cardIndex: number, seatIndex: number) => {
        updated[cardIndex].location = 'opponent';
        updated[cardIndex].seatIndex = seatIndex;
      };

      // Сначала игроку 6 карт
      const playerCount = Math.min(6, maxCardsForDeal - deckPos);
      for (let i = 0; i < playerCount; i++) {
        giveCardToPlayer(deckPos + i);
      }
      deckPos += playerCount;

      // Теперь оставшимся (numPlayers - 1) оппонентам
      const numOpponents = numPlayers - 1;
      for (let seat = 0; seat < numOpponents; seat++) {
        const oppCount = Math.min(6, maxCardsForDeal - deckPos);
        for (let i = 0; i < oppCount; i++) {
          giveCardToOpponent(deckPos + i, seat);
        }
        deckPos += oppCount;
      }

      return updated;
    });
  };

  // Сколько карт у "player"
  const playerCards = cards.filter((c) => c.location === 'player');

  // Оппоненты рисуем отдельным контейнером
  // (он может показать аватарки для каждого seatIndex)
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  return (
    <div className={styles.gameBoard}>

      {/* Тут будет контейнер всех оппонентов, 
          каждый оппонент может получить свой seatIndex */}
      <OpponentsContainer 
        numPlayers={numPlayers} 
        allOpponentCards={opponentCards}
      />

      {/* Игрок (кнопка Start, имя, и т.п.) */}
      <Player onStartGame={handleStartGame} cards={playerCards} />

      {/* Выкладываем все карты единой простынёй (Flip анимирует) */}
      {cards.map((card) => {
        const style = getCardStyle(card, cards, numPlayers);
        return (
          <div key={card.id} style={style}>
            <CardItem card={card} trumpSuit={trumpSuit} />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
