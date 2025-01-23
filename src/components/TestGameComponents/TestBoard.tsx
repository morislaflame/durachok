import React from 'react';
import TestCard from './TestCard';
import styles from './styles/TestBoard.module.css';
import Flip from 'gsap/Flip';


const TestBoard = () => {

    

    const moveCard = () => {
      const card = document.querySelector('.testCard');
      const testTop = document.querySelector('.testTop');
      const testBottom = document.querySelector('.testBottom');

      const state = Flip.getState(card, {
        props: 'background-color',
      })

      console.log(state);

      console.log(testTop);
        console.log(testBottom);
        console.log(card);
      
      if (testTop && testBottom && card) {
        if (card.parentNode === testTop) {
          testBottom.appendChild(card);
          card.classList.add('bottomCard');
        } else {
          testTop.appendChild(card);
          card.classList.remove('bottomCard');
        }
      }

      Flip.from(state, {
        absolute: true,
        nested: true,
        duration: 1,
        spin: 0.5,
        scale: true,
        ease: 'power1.inOut',
      });

      // Flip.fit(card, testBottom, {
      //   scale: true,
      //   duration: 1,
      //   ease: 'power1.inOut',
      // });
    }

  return <div className={`testBoard ${styles.testBoard}`}>

    <div className={`testTop ${styles.testTop}`}>
      <TestCard />
    </div>
    <button onClick={moveCard}>Move</button>
    <div className={`testBottom ${styles.testBottom}`}>
    

    </div>
  </div>;
};

export default TestBoard;