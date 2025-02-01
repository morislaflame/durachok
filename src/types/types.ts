import React from "react";

// types.ts
export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  location: 'deck' | 'player' | 'opponent' | 'table' | 'discard';
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

export type GameRules = {
  maxTablePairs: number;
  distanceThreshold: number;
  initialHandSize: number;
  attackRules: AttackRule[];
  defendRules: DefendRule[];
  slotRules: SlotRule[];
}

export type AttackRule = {
  type: 'rank' | 'suit' | 'combination';
  description: string;
  validator: (context: AttackValidationContext) => boolean;
}

export type DefendRule = {
  type: 'rank' | 'suit' | 'trump';
  description: string;
  validator: (context: DefendValidationContext) => boolean;
}

export type SlotRule = {
  type: 'distance' | 'position';
  validator: (context: SlotValidationContext) => boolean;
}

export type AttackValidationContext = {
  attackingCard: Card;
  tableCards: Card[];
  trumpSuit: Suit | null;
}

export type DefendValidationContext = {
  attackingCard: Card;
  defendingCard: Card;
  trumpSuit: Suit | null;
}

export type SlotValidationContext = {
  cardPosition: { x: number; y: number };
  slotPosition: { x: number; y: number };
  maxDistance: number;
}



export interface IconProps extends React.SVGProps<SVGSVGElement> {
  huy?: string;
}