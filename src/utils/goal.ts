// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------
import { AWAY_GOAL, Goal, HOME_GOAL } from '@/core/goal.js';
import { Side } from '@/core/side.js';

export function randomGoal(): Goal {
    const side = Math.random() < 0.5 ? Side.HOME : Side.AWAY;
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}

export function goalFromSide(side: Side): Goal {
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}
