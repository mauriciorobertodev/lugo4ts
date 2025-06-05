import { Player as LugoPlayer, Team_Side } from '../generated/server.js';

import type { IPlayer } from '../interfaces/player.d.ts';
import type { IRegion } from '../interfaces/region.d.ts';

import { Point } from './point.js';
import { Side } from './side.js';
import { SPECS } from './specs.js';
import { Vector2D } from './vector.js';
import { Velocity } from './velocity.js';

export class Player implements IPlayer {
    constructor(
        private number: number,
        private isJumping: boolean,
        private side: Side,
        private position: Point,
        private initPosition: Point,
        private velocity: Velocity
    ) {}

    getNumber(): number {
        return this.number;
    }

    getSpeed(): number {
        return this.velocity.getSpeed();
    }

    getDirection(): Vector2D {
        return this.velocity.getDirection();
    }

    getPosition(): Point {
        return this.position;
    }

    getVelocity(): Velocity {
        return this.velocity;
    }

    getTeamSide(): Side {
        return this.side;
    }

    getInitPosition(): Point {
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

    directionToPlayer(player: Player): Vector2D {
        return this.position.directionTo(player.getPosition());
    }

    distanceToPlayer(player: Player): number {
        return this.position.distanceTo(player.getPosition());
    }

    directionToRegion(region: IRegion): Vector2D {
        return this.position.directionTo(region.getCenter()) as Vector2D;
    }

    distanceToRegion(region: IRegion): number {
        return this.position.distanceTo(region.getCenter());
    }

    directionToPoint(point: Point): Vector2D {
        return this.position.directionTo(point) as Vector2D;
    }

    distanceToPoint(point: Point): number {
        return this.position.distanceTo(point);
    }

    toLugoPlayer(): LugoPlayer {
        return LugoPlayer.create({
            number: this.number,
            isJumping: this.isJumping,
            position: this.position.toLugoPoint(),
            initPosition: this.initPosition.toLugoPoint(),
            velocity: this.velocity.toLugoVelocity(),
            teamSide: this.side === Side.HOME ? Team_Side.HOME : Team_Side.AWAY,
        });
    }
}

export enum PlayerState {
    SUPPORTING = 'supporting',
    HOLDING = 'holding',
    DEFENDING = 'defending',
    DISPUTING = 'disputing',
}
