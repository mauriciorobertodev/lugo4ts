import type { ShotClock as LugoShotClock } from '../generated/server.js';

import { ShotClock } from '../core/clock.js';
import { SideFactory } from '../core/side.js';
import { SPECS } from '../core/specs.js';

export class ClockFactory {
    static fromLugoShotClock(lugoClock: LugoShotClock): ShotClock {
        return new ShotClock(
            SideFactory.fromInt(lugoClock.teamSide),
            lugoClock.remainingTurns ?? SPECS.SHOT_CLOCK_TIME
        );
    }
}
