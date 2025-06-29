import { ShotClockObject } from '@/interfaces/shot-clock.js';

import { ShotClock } from '@/core/shot-clock.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { randomInt } from '@/utils/random.js';
import { randomSide } from '@/utils/side.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
export function fromShotClockObject(obj: ShotClockObject): ShotClock {
    return new ShotClock(obj.holderSide, obj.remainingTurns);
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function zeroedShotClock(): ShotClock {
    return new ShotClock(Side.HOME, 0);
}

export function randomShotClock({
    teamSide = randomSide(),
    remainingTurns,
    maxRemainingTurns = SPECS.SHOT_CLOCK_TURNS,
}: {
    teamSide?: Side;
    remainingTurns?: number;
    maxRemainingTurns?: number;
} = {}): ShotClock {
    return new ShotClock(teamSide, remainingTurns ?? randomInt(1, maxRemainingTurns));
}
