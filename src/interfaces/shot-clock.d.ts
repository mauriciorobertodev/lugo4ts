import type { Side } from '../side.ts';

export interface IShotClock {
    getRemainingTurnsWithBall(): number;
    getTurnsWithBall(): number;
    getHolderSide(): Side;
}
