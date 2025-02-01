import React from "react";

// types.ts

export type Suit = 'H' | 'D' | 'C' | 'S';
export type Rank = '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14';

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


// {
//     "user_id"
// :
//     1,
//         "type"
// :
//     "game_state",
//         "data"
// :
//     {
//         "actions"
//     :
//         [
//             {
//                 "player_id": "1",
//                 "type": "attack_pass",
//                 "defending_card": null,
//                 "attacking_card": null
//             }
//         ],
//             "state"
//     :
//         {
//             "deck"
//         :
//             [
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "***",
//                 "8-C-t"
//             ],
//                 "players"
//         :
//             [
//                 {
//                     "id": "1",
//                     "is_winner": false,
//                     "is_defending": false,
//                     "cards": [
//                         "***",
//                         "***",
//                         "***",
//                         "***",
//                         "***"
//                     ]
//                 },
//                 {
//                     "id": "2",
//                     "is_winner": false,
//                     "is_defending": true,
//                     "cards": [
//                         "***",
//                         "***",
//                         "***",
//                         "***",
//                         "***",
//                         "***"
//                     ]
//                 }
//             ],
//                 "beaten"
//         :
//             [],
//                 "table"
//         :
//             [
//                 {
//                     "attacking": {
//                         "player_id": "1",
//                         "card": "11-S-f"
//                     },
//                     "defending": null,
//                     "defender_taking": false
//                 }
//             ],
//                 "current_player_id"
//         :
//             "1",
//                 "attackers_passes"
//         :
//             []
//         }
//     ,
//         "cards"
//     :
//         [
//             "9-S-f",
//             "6-C-t",
//             "10-D-f",
//             "10-S-f",
//             "12-D-f"
//         ]
//     }
// ,
//     "topic"
// :
//     "game_16"
// }
// \



export interface GameState {
    user_id: number;
    type: 'game_state';
    data: {
        actions: GameAction[];
        state: GameStateState;
        cards: string[];
    };
    topic: string;
}

export interface GameAction {
    player_id: string;
    type: 'attack_pass' | 'attack' | 'defend' | 'defend_pass';
    defending_card: string | null;
    attacking_card: string | null;
}


export interface GameStateState {
    deck: string[];
    players: PlayerState[];
    beaten: string[];
    table: TablePair[];
    current_player_id: string;
    attackers_passes: string[];
}


export interface PlayerState {
    id: string;
    is_winner: boolean;
    is_defending: boolean;
    cards: string[];
}

