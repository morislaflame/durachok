// tablePairsPositions.ts
export interface CardSlotPosition {
    top: number;
    left: number;
  }
  
  export interface TablePairPositions {
    attack: CardSlotPosition;
    cover: CardSlotPosition;
  }
  
  /**
   * Пример расположения 6 пар на столе.
   * attack - координаты "нижней" карты
   * cover - координаты "верхней" карты
   */
  export const TABLE_PAIRS_POSITIONS: TablePairPositions[] = [
    {
      attack: { top: 30, left: 20 },
      cover:  { top: 27, left: 24 },
    },
    {
      attack: { top: 30, left: 40 },
      cover:  { top: 27, left: 44 },
    },
    {
      attack: { top: 30, left: 60 },
      cover:  { top: 27, left: 64 },
    },
    {
      attack: { top: 50, left: 20 },
      cover:  { top: 47, left: 24 },
    },
    {
      attack: { top: 50, left: 40 },
      cover:  { top: 47, left: 44 },
    },
    {
      attack: { top: 50, left: 60 },
      cover:  { top: 47, left: 64 },
    },
  ];
  