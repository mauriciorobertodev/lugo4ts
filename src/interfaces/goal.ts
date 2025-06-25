import type { IPoint } from '@/interfaces/positionable.js';

import type { Side } from '@/core/side.js';

export interface IGoal {
    getCenter(): IPoint;
    getSide(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
