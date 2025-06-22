import type { IShotClock } from '@/interfaces.js';

import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

export class ShotClock implements IShotClock {
    constructor(
        private side: Side,
        private remainingTurns: number
    ) {}

    getRemainingTurnsWithBall(): number {
        return this.remainingTurns;
    }

    getTurnsWithBall(): number {
        return SPECS.SHOT_CLOCK_TIME - this.remainingTurns;
    }

    getHolderSide(): Side {
        return this.side;
    }
}
