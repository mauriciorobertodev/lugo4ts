import { IBall, IPlayer, IPoint, IRegion, IVector2D, IVelocity } from '@/interfaces.js';

import { Point } from '@/core/point.js';
import { SPECS } from '@/core/specs.js';

import { zeroedVelocity } from '@/utils/velocity.js';

export class Ball implements IBall {
    private position: IPoint;
    private velocity: IVelocity;

    constructor(
        position: IPoint | null,
        velocity: IVelocity | null,
        private holder: IPlayer | null
    ) {
        this.position = position ?? new Point(SPECS.FIELD_CENTER_X, SPECS.FIELD_CENTER_Y);
        this.velocity = velocity ?? zeroedVelocity();
    }

    setDirection(direction: IVector2D): this {
        this.velocity = this.velocity.setDirection(direction);
        return this;
    }

    setSpeed(speed: number): this {
        this.velocity = this.velocity.setSpeed(speed);
        return this;
    }

    getPosition(): IPoint {
        return this.position;
    }

    setPosition(position: IPoint): this {
        this.position = position;
        return this;
    }

    getVelocity(): IVelocity {
        return this.velocity;
    }

    setVelocity(velocity: IVelocity): this {
        this.velocity = velocity;
        return this;
    }

    getDirection(): IVector2D {
        return this.getVelocity().getDirection();
    }

    getSpeed(): number {
        return this.getVelocity().getSpeed();
    }

    hasHolder(): boolean {
        return !!this.holder;
    }

    getHolder(): IPlayer | null {
        return this.holder;
    }

    setHolder(holder: IPlayer | null): this {
        this.holder = holder;
        return this;
    }

    holderIs(holder: IPlayer): boolean {
        if (!this.holder) return false;
        return this.holder.getNumber() === holder.getNumber() && this.holder.getTeamSide() === holder.getTeamSide();
    }

    directionToPlayer(player: IPlayer): IVector2D {
        return this.getPosition().directionTo(player.getPosition());
    }

    directionToPoint(point: IPoint): IVector2D {
        return this.getPosition().directionTo(point);
    }

    directionToRegion(region: IRegion): IVector2D {
        return this.getPosition().directionTo(region.getCenter());
    }

    distanceToPlayer(player: IPlayer): number {
        return this.getPosition().distanceTo(player.getPosition());
    }

    distanceToPoint(point: IPoint): number {
        return this.getPosition().distanceTo(point);
    }

    distanceToRegion(region: IRegion): number {
        return this.getPosition().distanceTo(region.getCenter());
    }
}
