import gsap from 'gsap';
import { Card } from '../types/types';

interface DealAnimationConfig {
  playerCards: Card[];
  opponentCards: Card[];
  onComplete?: () => void;
}

export const animateDealingCards = ({ playerCards, opponentCards, onComplete }: DealAnimationConfig) => {
  const timeline = gsap.timeline({
    onComplete: () => onComplete?.(),
  });

  // Делаем карты видимыми перед анимацией
  gsap.set([
    '.player-card-0', '.player-card-1', '.player-card-2', 
    '.player-card-3', '.player-card-4', '.player-card-5',
    '.opponent-card-0', '.opponent-card-1', '.opponent-card-2', 
    '.opponent-card-3', '.opponent-card-4', '.opponent-card-5'
  ], {
    visibility: 'visible'
  });

  // Сначала скрываем все карты
  gsap.set(['.player-card-0', '.player-card-1', '.player-card-2', '.player-card-3', '.player-card-4', '.player-card-5'], {
    x: window.innerWidth / 2,
    y: -300,
    rotation: 0,
    scale: 0.7,
    opacity: 1,
  });

  gsap.set(['.opponent-card-0', '.opponent-card-1', '.opponent-card-2', '.opponent-card-3', '.opponent-card-4', '.opponent-card-5'], {
    x: window.innerWidth / 2,
    y: -300,
    rotation: 0,
    scale: 0.7,
    opacity: 1,
  });

  // Анимация для карт игрока
  playerCards.forEach((_, index) => {
    timeline.to(
      `.player-card-${index}`,
      {
        x: 0,
        y: 0,
        rotation: (index - playerCards.length / 2) * 3,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      index * 0.1
    );
  });

  // Анимация для карт оппонента
  opponentCards.forEach((_, index) => {
    timeline.to(
      `.opponent-card-${index}`,
      {
        x: 0,
        y: 0,
        rotation: (index - opponentCards.length / 2) * 10,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      index * 0.1 + playerCards.length * 0.1
    );
  });

  return timeline;
};