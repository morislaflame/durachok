// components/CardFace.tsx
import React from 'react';
import {Card as CardType, Rank, Suit} from '../../types/types';
import styles from './styles/Card.module.css';

interface CardFaceProps {
    card: CardType;
    isPlayerCard?: boolean;
    isTableCard?: boolean;
}

const CardFace: React.FC<CardFaceProps> = ({card, isPlayerCard, isTableCard}) => {
    const getSuitName = (suit: Suit) => {
        switch (suit) {
            case 'H':
                return 'Hearts';
            case 'D':
                return 'Diamonds';
            case 'C':
                return 'Clubs';
            case 'S':
                return 'Spades';
            default:
                return suit;
        }
    };

    const getNumberName = (rank: Rank) => {
        switch (rank) {
            case '6':
                return '6';
            case '7':
                return '7';
            case '8':
                return '8';
            case '9':
                return '9';
            case '10':
                return '10';
            case '11':
                return 'Jack';
            case '12':
                return 'Queen';
            case '13':
                return 'King';
            case '14':
                return 'Ace';
            default:
                return rank;
        }
    }

    const getCardBackground = (card: CardType) => {
        return `/cards/Suit=${getSuitName(card.suit)},Number=${getNumberName(card.rank)}.png`;
    }

    return (
        <div
            style={{
                backgroundImage: `url(${getCardBackground(card)})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
            }}
            className={`${styles.container} ${isPlayerCard ? styles.playerCard : ''} ${isTableCard ? styles.tableCard : ''}`}/>
    );
};

export default CardFace;
