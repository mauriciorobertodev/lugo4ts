import type { Side } from '../core/side.ts';

export interface IShotClock {
    getRemainingTurnsWithBall(): number;
    getTurnsWithBall(): number;
    getHolderSide(): Side;
}
