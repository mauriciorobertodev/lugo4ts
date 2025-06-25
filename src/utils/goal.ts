// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------
import { IGoal } from '@/interfaces/goal.js';

import { AWAY_GOAL, HOME_GOAL } from '@/core/goal.js';
import { Side } from '@/core/side.js';

export function randomGoal(): IGoal {
    const side = Math.random() < 0.5 ? Side.HOME : Side.AWAY;
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}

export function goalFromSide(side: Side): IGoal {
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}
