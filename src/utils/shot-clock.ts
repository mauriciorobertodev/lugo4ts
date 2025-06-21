import { IShotClock } from '@/interfaces.js';

import { SPECS, ShotClock, Side } from '@/core.js';

import { randomInt, randomSide } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedShotClock(): IShotClock {
    return new ShotClock(Side.HOME, 0);
}

export function randomShotClock({
    teamSide = randomSide(),
    remainingTurns,
    maxRemainingTurns = SPECS.SHOT_CLOCK_TIME,
}: {
    teamSide?: Side;
    remainingTurns?: number;
    maxRemainingTurns?: number;
} = {}): IShotClock {
    return new ShotClock(teamSide, remainingTurns ?? randomInt(1, maxRemainingTurns));
}
