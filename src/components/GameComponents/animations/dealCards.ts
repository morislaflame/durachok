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
    duration: 0.6,
    absolute: true,
    onEnter(elements) {
      return gsap.from(elements, { opacity: 0, y: -30 });
    },
    onLeave(elements) {
      return gsap.to(elements, { opacity: 0, y: 30 });
    },
    onComplete,
  });
}
