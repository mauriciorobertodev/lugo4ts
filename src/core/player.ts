import { IPlayer } from '@/interfaces/player.js';
import { IPoint, IVector2D } from '@/interfaces/positionable.js';
import { IRegion } from '@/interfaces/region.js';
import { IVelocity } from '@/interfaces/velocity.js';

import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';

export class Player implements IPlayer {
    constructor(
        private number: number,
        private isJumping: boolean,
        private side: Side,
        private position: IPoint,
        private initPosition: IPoint,
        private velocity: IVelocity
    ) {}

    getNumber(): number {
        return this.number;
    }

    getSpeed(): number {
        return this.velocity.getSpeed();
    }

    getDirection(): IVector2D {
        return this.velocity.getDirection();
    }

    getPosition(): IPoint {
        return this.position;
    }

    setPosition(position: Point): this {
        this.position = position;
        return this;
    }

    getVelocity(): IVelocity {
        return this.velocity;
    }

    getTeamSide(): Side {
        return this.side;
    }

    getInitPosition(): IPoint {
        return this.initPosition;
    }

    getIsJumping(): boolean {
        return this.isJumping;
    }

    isGoalkeeper(): boolean {
        return this.number === SPECS.GOALKEEPER_NUMBER;
    }

    is(player: Player): boolean {
        return this.eq(player);
    }

    eq(player: Player): boolean {
        return this.side === player.getTeamSide() && this.number === player.getNumber();
    }

    isInAttackSide(): boolean {
        const more = this.position.getX() > SPECS.FIELD_CENTER_X;
        return this.side === Side.HOME ? more : !more;
    }

    isInDefenseSide(): boolean {
        const less = this.position.getX() < SPECS.FIELD_CENTER_X;
        return this.side === Side.HOME ? less : !less;
    }

    directionToPlayer(player: IPlayer): IVector2D {
        return this.position.directionTo(player.getPosition());
    }

    distanceToPlayer(player: IPlayer): number {
        return this.position.distanceTo(player.getPosition());
    }

    directionToRegion(region: IRegion): IVector2D {
        return this.position.directionTo(region.getCenter());
    }

    distanceToRegion(region: IRegion): number {
        return this.position.distanceTo(region.getCenter());
    }

    directionToPoint(point: IPoint): IVector2D {
        return this.position.directionTo(point) as Vector2D;
    }

    distanceToPoint(point: IPoint): number {
        return this.position.distanceTo(point);
    }
}

export enum PlayerState {
    SUPPORTING = 'supporting',
    HOLDING = 'holding',
    DEFENDING = 'defending',
    DISPUTING = 'disputing',
}
