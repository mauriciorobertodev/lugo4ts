import { Ball as LugoBall } from '../generated/server.js';

import { IBall } from '../interfaces/ball.js';

import { VelocityFactory } from '../factories/velocity.factory.js';

import { Player } from './player.js';
import { Point } from './point.js';
import { Region } from './region.js';
import { SPECS } from './specs.js';
import { Vector2D } from './vector.js';
import { Velocity } from './velocity.js';

export class Ball implements IBall {
    private position: Point;
    private velocity: Velocity;

    constructor(
        position: Point | null,
        velocity: Velocity | null,
        private holder: Player | null
    ) {
        this.position = position ?? new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y);
        this.velocity = velocity ?? VelocityFactory.newZeroed();
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

    setVelocity(velocity: Velocity): this {
        this.velocity = velocity;
        return this;
    }

    getDirection(): Vector2D {
        return this.getVelocity().getDirection();
    }

    getSpeed(): number {
        return this.getVelocity().getSpeed();
    }

    hasHolder(): boolean {
        return !!this.holder;
    }

    getHolder(): Player | null {
        return this.holder;
    }

    holderIs(holder: Player): boolean {
        if (!this.holder) return false;
        return this.holder.getNumber() === holder.getNumber() && this.holder.getTeamSide() === holder.getTeamSide();
    }

    directionToPlayer(player: Player): Vector2D {
        return this.getPosition().directionTo(player.getPosition());
    }

    directionToPoint(point: Point): Vector2D {
        return this.getPosition().directionTo(point);
    }

    directionToRegion(region: Region): Vector2D {
        return this.getPosition().directionTo(region.getCenter());
    }

    distanceToPlayer(player: Player): number {
        return this.getPosition().distanceTo(player.getPosition());
    }

    distanceToPoint(point: Point): number {
        return this.getPosition().distanceTo(point);
    }

    distanceToRegion(region: Region): number {
        return this.getPosition().distanceTo(region.getCenter());
    }

    toLugoBall(): LugoBall {
        return LugoBall.create({
            position: this.getPosition().toLugoPoint(),
            velocity: this.getVelocity().toLugoVelocity(),
            holder: this.getHolder()?.toLugoPlayer(),
        });
    }
}
