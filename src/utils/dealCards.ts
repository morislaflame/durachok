// dealCards.ts
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

/**
 * Самостоятельно создаём тип FlipState,
 * опираясь на то, что возвращает Flip.getState(...)
 */
export type FlipState = ReturnType<typeof Flip.getState>;

/**
 * Снимаем "снимок" (Flip.getState) всех .cardWrapper
 */
export function captureFlipState(): FlipState {
  return Flip.getState('.cardWrapper');
}

/**
 * Запускаем анимацию из oldState в текущее DOM-расположение
 */
export function animateFlip(oldState: FlipState, onComplete?: () => void) {
  // Ждём, пока React DOM обновится после setState
  requestAnimationFrame(() => {
    Flip.from(oldState, {
      duration: 0.6,
      ease: 'power2.out',
      onComplete,
    });
  });
}
