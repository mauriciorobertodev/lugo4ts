import type { IShotClock } from '../interfaces/shot-clock.d.ts';

import { Side } from './side.js';
import { SPECS } from './specs.js';

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
