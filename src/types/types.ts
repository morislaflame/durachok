// types.ts
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;  
  suit: Suit;
  rank: Rank;
  location: 'deck' | 'player' | 'opponent';
}
