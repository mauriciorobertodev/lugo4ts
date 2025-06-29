import type { IVector2D, Vector2DObject } from './positionable.js';

export interface IVelocity {
    getDirection(): IVector2D;
    setDirection(direction: IVector2D): this;

    getSpeed(): number;
    setSpeed(speed: number): this;

    clone(): IVelocity;
    toObject(): VelocityObject;
}

export type VelocityObject = {
    direction: Vector2DObject;
    speed: number;
};
