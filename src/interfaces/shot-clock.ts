import type { Side } from '@/core/side.js';

export interface IShotClock {
    getRemainingTurnsWithBall(): number;
    getTurnsWithBall(): number;
    getHolderSide(): Side;
}

export type ShotClockObject = {
    remainingTurnsWithBall: number;
    turnsWithBall: number;
    holderSide: Side;
};
