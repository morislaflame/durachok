// dealCards.ts
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

export type FlipState = ReturnType<typeof Flip.getState>;

/** Снимаем состояние */
export function captureFlipState(): FlipState {
  return Flip.getState('.cardBox', {
    props: 'transform, top, left, background'
  });
}

/** Анимируем */
export function animateFlip(oldState: FlipState, onComplete?: () => void) {
  Flip.from(oldState, {
    duration: 0.8,
    scale: true,
    absolute: true,
    stagger: 0.05,
    ease: 'power3.out',
    onComplete,
  });
}


