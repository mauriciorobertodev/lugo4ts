import type { IPoint } from './positionable.d.ts';
import type { IGoal } from './goal.d.ts';
import type { Side } from '../side.ts';

export interface IGoal {
    getCenter(): IPoint;
    getPlace(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
