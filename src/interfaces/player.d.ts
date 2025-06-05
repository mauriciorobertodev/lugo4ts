import type { Side } from '../side.ts';
import type { IPlayer } from './player.ts';
import type { IPoint, IVector2D } from './positionable.ts';
import type { IRegion } from './region.ts';
import type { IVelocity } from './velocity.ts';

export interface IPlayer {
    getNumber(): number;
    getSpeed(): number;
    getDirection(): IVector2D;
    getPosition(): IPoint;
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
