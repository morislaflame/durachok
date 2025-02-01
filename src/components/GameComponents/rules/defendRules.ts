import { DefendRule, DefendValidationContext } from '../../../types/types';
import { canCoverCard } from '../utils/canCoverCard';

export const defaultDefendRules: DefendRule[] = [
  {
    type: 'rank',
    description: 'Защитная карта должна бить атакующую',
    validator: (context) => canCoverCard(
      context.attackingCard,
      context.defendingCard,
      context.trumpSuit
    )
  }
];