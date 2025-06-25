import type { IVector2D } from './positionable.js';

export interface IVelocity {
    getDirection(): IVector2D;
    setDirection(direction: IVector2D): this;

    getSpeed(): number;
    setSpeed(speed: number): this;
}
