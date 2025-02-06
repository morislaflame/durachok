// canCoverCard.ts
import { Card, Suit, Rank } from '../../../types/types';

// Старшинство рангов
const rankOrder = ['6','7','8','9','10','11','12','13','14'];

function rankValue(r: Rank): number {
  return rankOrder.indexOf(r);
}

/**
 * Проверяет, бьёт ли coverCard атаку attackCard, с учётом козыря trumpSuit.
 */
export function canCoverCard(attackCard: Card, coverCard: Card, trumpSuit: Suit | null): boolean {
  if (!trumpSuit) {
    // если вообще нет козыря, допустим, бить можно только по масти + старше
    return (
      coverCard.suit === attackCard.suit &&
      rankValue(coverCard.rank) > rankValue(attackCard.rank)
    );
  }

  const attackIsTrump = (attackCard.suit === trumpSuit);
  const coverIsTrump = (coverCard.suit === trumpSuit);

  if (!attackIsTrump) {
    // атакующая карта не козырь
    // Крыть можно или старшей той же масти, или любым козырем
    if (coverCard.suit === attackCard.suit && rankValue(coverCard.rank) > rankValue(attackCard.rank)) {
      return true;
    }
    if (coverIsTrump) {
      return true;
    }
    return false;
  } else {
    // атакующая - козырь, значит крыть только козырем старше
    if (coverIsTrump && rankValue(coverCard.rank) > rankValue(attackCard.rank)) {
      return true;
    }
    return false;
  }
}
