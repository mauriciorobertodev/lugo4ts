import type { Side } from '../side.ts';
import type { IGoal } from './goal.ts';
import type { IPoint } from './positionable.ts';

export interface IGoal {
    getCenter(): IPoint;
    getPlace(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
