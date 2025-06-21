import type { IPoint } from '@/interfaces.js';

import type { Side } from '@/core.js';

export interface IGoal {
    getCenter(): IPoint;
    getSide(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
