import React from "react";

// types.ts
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  location: 'deck' | 'player' | 'opponent' | 'table';
  /** Какой именно оппонент владеет картой. */
  seatIndex?: number;
  /** Позиция на столе. */
  // tablePositionIndex?: number;
  tablePairIndex?: number;
  tableRole?: 'attack' | 'cover';
}

export interface TablePair {
  attackCardId: string | null;
  coverCardId: string | null;
}

export interface Player {
  id: string;
  hand: Card[];
}



export interface IconProps extends React.SVGProps<SVGSVGElement> {
  huy?: string;
}