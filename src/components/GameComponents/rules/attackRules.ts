import { AttackRule, AttackValidationContext } from '../../../types/types';

export const defaultAttackRules: AttackRule[] = [
  {
    type: 'rank',
    description: 'Можно подкидывать только карты существующих значений на столе',
    validator: (context) => {
      const existingRanks = new Set(context.tableCards.map(c => c.rank));
      return existingRanks.size === 0 || existingRanks.has(context.attackingCard.rank);
    }
  }
];