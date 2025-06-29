import type { IPoint, IVector2D, PointObject } from '@/interfaces/positionable.js';
import type { IRegion } from '@/interfaces/region.js';
import type { IVelocity, VelocityObject } from '@/interfaces/velocity.js';

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

export enum PlayerState {
    SUPPORTING = 'supporting',
    HOLDING = 'holding',
    DEFENDING = 'defending',
    DISPUTING = 'disputing',
}

export type PlayerObject = {
    number: number;
    side: Side;
    position: PointObject;
    initPosition: PointObject;
    velocity: VelocityObject;
    isGoalkeeper?: boolean;
    isJumping?: boolean;
};
