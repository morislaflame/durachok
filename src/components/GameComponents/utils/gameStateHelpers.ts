// Например, в файле gameStateHelpers.ts
import { GameState, Card, PlayerState } from '../../../types/types';

/**
 * Функция для генерации уникального идентификатора для карты.
 */
const generateStableId = (index: number): string => {
  // Можно использовать любые генераторы, здесь просто пример
  return `card-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

/**
 * Инициализация начального состояния игры.
 * Здесь создаём 36 карт, все они находятся в колоде (location: 'deck'),
 * и каждому присваивается stableId.
 * Также формируем массив игроков, число которых соответствует numPlayers.
 */
export const initializeGameState = (numPlayers: number): { gameState: GameState; cards: Card[] } => {
    const effectiveNumPlayers = numPlayers > 0 ? numPlayers : 2;
  const totalCards = 36;

  // Создаём массив объектов Card.
  // В этом примере для простоты все карты имеют одинаковые масть и ранг,
  // но вы можете изменить логику генерации, чтобы получить полноценную колоду.
  const cards: Card[] = Array.from({ length: totalCards }, (_, index) => ({
    suit: 'H',            // или можно варьировать масть
    rank: '6',            // аналогично для ранга
    location: 'deck',     // изначально все карты в колоде
    stableId: generateStableId(index),
  }));

  // Массив строк для передачи в GameState. Здесь, согласно вашему примеру,
  // каждая карта обозначается как '***'. Если потребуется, можно сохранить более подробное представление.
  const deckStrings: string[] = Array(totalCards).fill('***');

  // Создаём массив игроков: первый игрок — например, игрок, остальные — оппоненты.
  const players: PlayerState[] = Array.from({ length: effectiveNumPlayers }, (_, index) => ({
    id: `${index + 1}`,
    is_winner: false,
    is_defending: index === 0, // по желанию, например, первый игрок может быть дефендящим
    cards: [], // начально у игроков нет карт в руке
  }));

  const currentPlayerId = players[0] ? players[0].id : '0';

  const gameState: GameState = {
    data: {
      actions: [],
      state: {
        attackers_passes: [],
        beaten: [],
        current_player_id: currentPlayerId,
        deck: deckStrings,
        players: players,
        table: [],

      },
      cards: deckStrings, // здесь можно дублировать или использовать другое представление колоды
    },
    topic: 'game_state',
    type: 'game_state',
    user_id: 1, // можно установить текущего пользователя
  };

  return { gameState, cards };
};
