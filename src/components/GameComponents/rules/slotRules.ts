import { SlotRule, SlotValidationContext } from '../../../types/types';

export const defaultSlotRules: SlotRule[] = [
  {
    type: 'distance',
    validator: (context) => {
      const distance = Math.hypot(
        context.cardPosition.x - context.slotPosition.x,
        context.cardPosition.y - context.slotPosition.y
      );
      return distance <= context.maxDistance;
    }
  }
];