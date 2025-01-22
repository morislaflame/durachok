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
    // onEnter(elements) {
    //   console.log('onEnter called with elements:', elements);
    //   return gsap.from(elements, { 
    //     opacity: 0, 
    //     y: -30, 
    //     stagger: 0.1, // Добавляем задержку 0.1 секунды между анимациями
    //     ease: "power2.out" 
    //   });
    // },
    // onLeave(elements) {
    //   console.log('onLeave called with elements:', elements);
    //   return gsap.to(elements, { 
    //     opacity: 0, 
    //     y: 30, 
    //     stagger: 0.05,
    //     ease: "power2.in" 
    //   });
    // },
    onComplete,
  });
}
