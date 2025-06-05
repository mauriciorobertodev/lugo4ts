import { Point as LugoPoint, Vector as LugoVector } from '../generated/physics.js';

import type { IPositionable } from '../interfaces/positionable.d.ts';

import { Point } from './point.js';
import { Vector2D } from './vector.js';

export abstract class IsPositionable implements IPositionable {
    protected x: number = 0;
    protected y: number = 0;

    getX(): number {
        return this.x;
    }

    setX(x: number): this {
        this.x = +x.toFixed(10);
        return this;
    }

    addX(value: number): this {
        return this.setX(this.x + value);
    }

    subtractX(value: number): this {
        return this.setX(this.x - value);
    }

    scaleX(value: number): this {
        return this.setX(this.x * value);
    }

    divideX(value: number): this {
        if (value !== 0) {
            this.setX(this.x / value);
        }
        return this;
    }

    getY(): number {
        return this.y;
    }

    setY(y: number): this {
        this.y = +y.toFixed(10);
        return this;
    }

    addY(value: number): this {
        return this.setY(this.y + value);
    }

    subtractY(value: number): this {
        return this.setY(this.y - value);
    }

    scaleY(value: number): this {
        return this.setY(this.y * value);
    }

    divideY(value: number): this {
        if (value !== 0) {
            this.setY(this.y / value);
        }
        return this;
    }

    normalize(): this {
        const magnitude = this.magnitude();
        if (magnitude > 0) {
            this.divideX(magnitude);
            this.divideY(magnitude);
        }
        return this;
    }

    normalized(): IPositionable {
        return this.clone().normalize();
    }

    add(value: IPositionable | number): this {
        if (typeof value === 'number') {
            this.addX(value);
            this.addY(value);
        } else {
            this.addX(value.getX());
            this.addY(value.getY());
        }
        return this;
    }

    added(value: IPositionable | number): IPositionable {
        return this.clone().add(value);
    }

    subtract(value: IPositionable | number): this {
        if (typeof value === 'number') {
            this.subtractX(value);
            this.subtractY(value);
        } else {
            this.subtractX(value.getX());
            this.subtractY(value.getY());
        }
        return this;
    }

    subtracted(value: IPositionable | number): IPositionable {
        return this.clone().subtract(value);
    }

    divide(value: IPositionable | number): this {
        if (typeof value === 'number') {
            this.divideX(value);
            this.divideY(value);
        } else {
            this.divideX(value.getX());
            this.divideY(value.getY());
        }
        return this;
    }

    divided(value: IPositionable | number): IPositionable {
        return this.clone().divide(value);
    }

    scale(value: IPositionable | number): this {
        if (typeof value === 'number') {
            this.scaleX(value);
            this.scaleY(value);
        } else {
            this.scaleX(value.getX());
            this.scaleY(value.getY());
        }
        return this;
    }

    scaled(value: IPositionable | number): IPositionable {
        return this.clone().scale(value);
    }

    magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    directionTo(to: IPositionable): Vector2D {
        return to.subtracted(this).normalize().toVector2D() as Vector2D;
    }

    distanceTo(to: IPositionable): number {
        return to.subtracted(this).magnitude();
    }

    moveToDirection(direction: Vector2D, distance: number): this {
        return this.add(direction.normalized().scale(distance));
    }

    movedToDirection(direction: Vector2D, distance: number): IPositionable {
        return this.added(direction.normalized().scale(distance));
    }

    moveToPoint(point: Point, distance: number): this {
        return this.moveToDirection(this.directionTo(point), distance);
    }

    movedToPoint(point: Point, distance: number): IPositionable {
        return this.movedToDirection(this.directionTo(point), distance);
    }

    toLugoPoint(): LugoPoint {
        return LugoPoint.create({ x: this.x, y: this.y });
    }

    toLugoVector(): LugoVector {
        return LugoVector.create({ x: this.x, y: this.y });
    }

    toString(): string {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    }

    toVector2D(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    toPoint(): Point {
        return new Point(this.x, this.y);
    }

    is(positionable: IPositionable): boolean {
        return this.getX() === positionable.getX() && this.getY() === positionable.getY();
    }

    eq(positionable: IPositionable): boolean {
        return this.is(positionable);
    }

    abstract clone(): IPositionable;
}
