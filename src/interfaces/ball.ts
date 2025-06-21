import type { IPlayer, IPoint, IRegion, IVector2D, IVelocity } from '@/interfaces.js';

export interface IBall {
    getPosition(): IPoint;
    setPosition(pos: IPoint): this;

    getVelocity(): IVelocity;
    setVelocity(vel: IVelocity): this;

    getDirection(): IVector2D;
    setDirection(direction: IVector2D): this;

    getSpeed(): number;
    setSpeed(speed: number): this;

    hasHolder(): boolean;
    getHolder(): IPlayer | null;
    holderIs(holder: IPlayer): boolean;

    directionToPlayer(player: IPlayer): IVector2D;
    directionToPoint(point: IPoint): IVector2D;
    directionToRegion(region: IRegion): IVector2D;

    distanceToPlayer(player: IPlayer): number;
    distanceToPoint(point: IPoint): number;
    distanceToRegion(region: IRegion): number;
}

export type BallObject = {
    position: IPoint;
    velocity: IVelocity;
    holder: IPlayer | null;
};
