import { BallObject, IBall } from '@/interfaces/ball.js';

import { Player } from '@/core/player.js';
import { Point } from '@/core/point.js';
import { Region } from '@/core/region.js';
import { SPECS } from '@/core/specs.js';
import { Vector2D } from '@/core/vector.js';
import { Velocity } from '@/core/velocity.js';

import { zeroedVelocity } from '@/utils/velocity.js';

export class Ball implements IBall {
    private position: Point;
    private velocity: Velocity;

    constructor(
        position: Point | null,
        velocity: Velocity | null,
        private holder: Player | null
    ) {
        this.position = position ?? new Point(SPECS.CENTER_X_COORDINATE, SPECS.CENTER_Y_COORDINATE);
        this.velocity = velocity ?? zeroedVelocity();
    }

    setDirection(direction: Vector2D): this {
        this.velocity = this.velocity.setDirection(direction);
        return this;
    }

    setSpeed(speed: number): this {
        this.velocity = this.velocity.setSpeed(speed);
        return this;
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

    setHolder(holder: Player | null): this {
        this.holder = holder;
        return this;
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

    clone(): Ball {
        return new Ball(this.position.clone(), this.velocity.clone(), this.holder);
    }

    toObject(): BallObject {
        return {
            position: this.position.toObject(),
            velocity: this.velocity.toObject(),
            holder: this.holder ? this.holder.toObject() : null,
        };
    }
}
