import { GoalObject } from '@/interfaces/goal.js';

import { AWAY_GOAL, Goal, HOME_GOAL } from '@/core/goal.js';
import { Side } from '@/core/side.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
export function fromGoalObject(obj: GoalObject): Goal {
    return obj.side === Side.HOME ? HOME_GOAL.clone() : AWAY_GOAL.clone();
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function randomGoal(): Goal {
    const side = Math.random() < 0.5 ? Side.HOME : Side.AWAY;
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}

export function goalFromSide(side: Side): Goal {
    return side === Side.HOME ? HOME_GOAL : AWAY_GOAL;
}
