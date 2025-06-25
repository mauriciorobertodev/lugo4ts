import type { IPoint, IVector2D } from '@/interfaces/positionable.js';
import type { IRegion } from '@/interfaces/region.js';
import type { IVelocity } from '@/interfaces/velocity.js';

import type { Side } from '@/core/side.js';

export interface IPlayer {
    getNumber(): number;
    getSpeed(): number;
    getDirection(): IVector2D;

    getPosition(): IPoint;
    setPosition(position: IPoint): this;

    getVelocity(): IVelocity;
    getTeamSide(): Side;
    getInitPosition(): IPoint;

    getIsJumping(): boolean;
    isGoalkeeper(): boolean;

    is(player: IPlayer): boolean;
    eq(player: IPlayer): boolean;

    isInAttackSide(): boolean;
    isInDefenseSide(): boolean;

    directionToPlayer(player: IPlayer): IVector2D;
    directionToPoint(point: IPoint): IVector2D;
    directionToRegion(region: IRegion): IVector2D;

    distanceToPlayer(player: IPlayer): number;
    distanceToPoint(point: IPoint): number;
    distanceToRegion(region: IRegion): number;
}
