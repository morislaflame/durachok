// utils/suitSymbols.ts
import { Suit } from '../../../types/types';

export function getSuitSymbol(suit: Suit): string {
  switch (suit) {
    case 'H':
      return '♥';
    case 'D':
      return '♦';
    case 'C':
      return '♣';
    case 'S':
      return '♠';
    default:
      return '';
  }
}

export function getSuitClass(suit: Suit): string {
  return suit === 'H' || suit === 'D' ? 'red' : 'black';
}

