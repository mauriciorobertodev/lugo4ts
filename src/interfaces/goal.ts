import type { Side } from '../core/side.ts';
import type { IPoint } from './positionable.js';

export interface IGoal {
    getCenter(): IPoint;
    getPlace(): Side;
    getTopPole(): IPoint;
    getBottomPole(): IPoint;
}
