import type { Side } from '@/core.js';

export interface IShotClock {
    getRemainingTurnsWithBall(): number;
    getTurnsWithBall(): number;
    getHolderSide(): Side;
}
