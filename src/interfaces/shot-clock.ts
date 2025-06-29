import type { Side } from '@/core/side.js';

export interface IShotClock {
    getRemainingTurnsWithBall(): number;
    getTurnsWithBall(): number;
    getHolderSide(): Side;

    clone(): IShotClock;
    toObject(): ShotClockObject;
}

export type ShotClockObject = {
    remainingTurns: number;
    holderSide: Side;
};
