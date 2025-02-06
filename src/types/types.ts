import React from "react";

// types.ts

export type Suit = 'H' | 'D' | 'C' | 'S';
export type Rank = '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14';

export interface Card {
    // id: string;
    suit: Suit;
    rank: Rank;
    location: 'deck' | 'player' | 'opponent' | 'table' | 'discard';
    /** Какой именно оппонент владеет картой. */
    seatIndex?: number;
    tablePairIndex?: number;
    tableRole?: 'attack' | 'cover';
    stableId?: string;
    trumpFlag?: 'f' | 't';
    playerId?: number;
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

export interface GameActions {
    data: GameActionData;
    topic: string;
    type: 'game_action';
    user_id: number | null;
}

export interface GameActionData {
    player_id: string;
    type: 'attack_pass' | 'attack_card' | 'defend_card' | 'defend_take';
    defending_card: string | null;
    attacking_card: string | null;
}

export interface GameState {
    data: {
        actions: GameAction[];
        state: GameStateState;
        cards: string[];
    };
    topic: string;
    type: 'game_state' | 'game_action';
    user_id: number;
}

export interface GameAction {
    player_id: string;
    type: 'attack_pass' | 'attack_card' | 'defend_card' | 'defend_take';
    defending_card: string | null;
    attacking_card: string | null;

}

export interface GameStateState {
    attackers_passes: string[];
    beaten: string[];
    current_player_id: string;
    deck: string[];
    players: PlayerState[];
    table: Table[];
}

export interface PlayerState {
    id: string;
    is_winner: boolean;
    is_defending: boolean;
    cards: string[];
}

export interface Table {
  attacking: {
    player_id: string;
    card: string;
  };
  defending: string | null;
  defender_taking: boolean;
}
