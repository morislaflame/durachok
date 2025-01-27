// utils/suitSymbols.ts
import { Suit } from '../../../types/types';

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
    default:
      return '';
  }
}

export function getSuitClass(suit: Suit): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'red'
  : 'black';
}

