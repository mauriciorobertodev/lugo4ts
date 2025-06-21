import { IGoal } from '@/interfaces.js';

import { AWAY_GOAL, HOME_GOAL, Side } from '@/core.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function randomGoal(): IGoal {
    const side = Math.random() < 0.5 ? Side.HOME : Side.AWAY;
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}

export function goalFromSide(side: Side): IGoal {
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}
