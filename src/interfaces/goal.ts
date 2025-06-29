import type { IPoint, PointObject } from '@/interfaces/positionable.js';

import type { Side } from '@/core/side.js';

export interface IGoal {
    getCenter(): IPoint;
    getSide(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}

export type GoalObject = {
    center: PointObject;
    side: Side;
    topPole: PointObject;
    bottomPole: PointObject;
};
