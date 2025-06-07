import type { ShotClock as LugoShotClock } from '../generated/server.js';

import { ShotClock } from '../core/clock.js';
import { Side, SideFactory } from '../core/side.js';
import { SPECS } from '../core/specs.js';
import { Util } from '../core/util.js';

export class ClockFactory {
    static fromLugoShotClock(lugoClock: LugoShotClock): ShotClock {
        return new ShotClock(
            SideFactory.fromInt(lugoClock.teamSide),
            lugoClock.remainingTurns ?? SPECS.SHOT_CLOCK_TIME
        );
    }

    static random({
        teamSide = SideFactory.random(),
        remainingTurns,
        maxRemainingTurns = SPECS.SHOT_CLOCK_TIME,
    }: {
        teamSide?: Side;
        remainingTurns?: number;
        maxRemainingTurns?: number;
    } = {}): ShotClock {
        return new ShotClock(teamSide, remainingTurns ?? Util.randomInt(1, maxRemainingTurns));
    }
}
