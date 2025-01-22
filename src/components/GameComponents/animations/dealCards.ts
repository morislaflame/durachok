// dealCards.ts
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export type FlipState = ReturnType<typeof Flip.getState>;

/** Снимаем состояние */
export function captureFlipState(): FlipState {
  return Flip.getState('.cardWrapper');
}

/** Анимируем */
export function animateFlip(oldState: FlipState, onComplete?: () => void) {
  Flip.from(oldState, {
    duration: 0.9,
    absolute: true,
    stagger: 0.05,
    onComplete,
  });
}
