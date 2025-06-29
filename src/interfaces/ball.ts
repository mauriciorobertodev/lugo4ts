import type { IPlayer, PlayerObject } from '@/interfaces/player.js';
import type { IPoint, IVector2D, PointObject } from '@/interfaces/positionable.js';
import type { IRegion } from '@/interfaces/region.js';
import type { IVelocity, VelocityObject } from '@/interfaces/velocity.js';

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
    setHolder(holder: IPlayer | null): this;
    holderIs(holder: IPlayer): boolean;

    directionToPlayer(player: IPlayer): IVector2D;
    directionToPoint(point: IPoint): IVector2D;
    directionToRegion(region: IRegion): IVector2D;

    distanceToPlayer(player: IPlayer): number;
    distanceToPoint(point: IPoint): number;
    distanceToRegion(region: IRegion): number;

    clone(): IBall;
    toObject(): BallObject;
}

export type BallObject = {
    position: PointObject;
    velocity: VelocityObject;
    holder: PlayerObject | null;
};
