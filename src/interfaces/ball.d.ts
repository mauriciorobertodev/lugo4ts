import type { IPoint, IVector2D } from './positionable.d.ts';
import type { IRegion } from './region.d.ts';
import type { IVelocity } from './velocity.d.ts';

export interface IBall {
    getPosition(): IPoint;
    setPosition(pos: IPoint): this;

    getVelocity(): IVelocity;
    setVelocity(vel: IVelocity): this;

    getDirection(): IVector2D;
    getSpeed(): number;

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
