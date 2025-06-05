import type { Side } from '../side.ts';
import type { IGoal } from './goal.d.ts';
import type { IPoint } from './positionable.d.ts';

export interface IGoal {
    getCenter(): IPoint;
    getPlace(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
