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
      attack: { top: 40, left: 30 },
      cover:  { top: 37, left: 34 },
    },
    {
      attack: { top: 40, left: 50 },
      cover:  { top: 37, left: 54 },
    },
    {
      attack: { top: 40, left: 70 },
      cover:  { top: 37, left: 74 },
    },
    {
      attack: { top: 50, left: 30 },
      cover:  { top: 47, left: 34 },
    },
    {
      attack: { top: 50, left: 50 },
      cover:  { top: 47, left: 54 },
    },
    {
      attack: { top: 50, left: 70 },
      cover:  { top: 47, left: 74 },
    },
  ];
  