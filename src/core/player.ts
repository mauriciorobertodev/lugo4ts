import { IPlayer } from '@/interfaces/player.js';

import { Point } from '@/core/point.js';
import { Region } from '@/core/region.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

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

    setPosition(position: Point): this {
        this.position = position;
        return this;
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
        const more = this.position.getX() > SPECS.CENTER_X_COORDINATE;
        return this.side === Side.HOME ? more : !more;
    }

    isInDefenseSide(): boolean {
        const less = this.position.getX() < SPECS.CENTER_X_COORDINATE;
        return this.side === Side.HOME ? less : !less;
    }

    directionToPlayer(player: IPlayer): Vector2D {
        return this.position.directionTo(player.getPosition());
    }

    distanceToPlayer(player: IPlayer): number {
        return this.position.distanceTo(player.getPosition());
    }

    directionToRegion(region: Region): Vector2D {
        return this.position.directionTo(region.getCenter());
    }

    distanceToRegion(region: Region): number {
        return this.position.distanceTo(region.getCenter());
    }

    directionToPoint(point: Point): Vector2D {
        return this.position.directionTo(point) as Vector2D;
    }

    distanceToPoint(point: Point): number {
        return this.position.distanceTo(point);
    }
}
