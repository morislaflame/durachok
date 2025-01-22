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

  // 1) Генерация колоды при первом рендере
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
  }, []);

  // 2) Если flipStateRef не пуст, делаем анимацию Flip при изменении стейта cards
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
    }
  }, [cards]);

  // 3) Start Game: выбираем нижнюю карту как козырь, раздаём игроку 6, и оппонентам
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

      // функция "отдать карту игроку"
      const giveCardToPlayer = (i: number) => {
        updated[i].location = 'player';
        updated[i].seatIndex = undefined;
      };
      // функция "отдать карту конкретному оппоненту seatIndex"
      const giveCardToOpponent = (i: number, seat: number) => {
        updated[i].location = 'opponent';
        updated[i].seatIndex = seat;
      };

      // 1) Игроку 6 карт (если хватает)
      const playerCount = Math.min(6, maxCardsForDeal - deckPos);
      for (let i = 0; i < playerCount; i++) {
        giveCardToPlayer(deckPos + i);
      }
      deckPos += playerCount;

      // 2) Каждому оппоненту тоже 6 карт
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

  const playerCards = cards.filter((c) => c.location === 'player');
  const opponentCards = cards.filter((c) => c.location === 'opponent');

  return (
    <div className={styles.gameBoard}>
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
            <CardItem card={card} trumpSuit={trumpSuit} />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
