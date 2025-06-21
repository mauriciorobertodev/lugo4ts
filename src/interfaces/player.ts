import type { IPoint, IRegion, IVector2D, IVelocity } from '@/interfaces.js';

import type { Side } from '@/core.js';

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
