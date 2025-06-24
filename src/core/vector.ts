import type { IPositionable, IVector2D } from '@/interfaces.js';

export class Vector2D implements IVector2D {
    constructor(
        private x = 0,
        private y = 0
    ) {}

    getX(): number {
        return this.x;
    }

    setX(x: number): this {
        this.x = x;
        return this;
    }

    getY(): number {
        return this.y;
    }

    setY(y: number): this {
        this.y = y;
        return this;
    }

    clone(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    addX(value: number): this {
        return this.setX(this.getX() + value);
    }

    subtractX(value: number): this {
        return this.setX(this.getX() - value);
    }

    scaleX(value: number): this {
        return this.setX(this.getX() * value);
    }

    divideX(value: number): this {
        if (value !== 0) {
            this.setX(this.getX() / value);
        }
        return this;
    }

    addY(value: number): this {
        return this.setY(this.getY() + value);
    }

    subtractY(value: number): this {
        return this.setY(this.getY() - value);
    }

    scaleY(value: number): this {
        return this.setY(this.getY() * value);
    }

    divideY(value: number): this {
        if (value !== 0) {
            this.setY(this.getY() / value);
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

    normalized(): IVector2D {
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

    added(value: IPositionable | number): IVector2D {
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

    subtracted(value: IPositionable | number): IVector2D {
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

    divided(value: IPositionable | number): IVector2D {
        return this.clone().divide(value);
    }

    scale(value: IPositionable | number): this {
        if (typeof value === 'number') {
            this.scaleX(value).scaleY(value);
        } else {
            this.scaleX(value.getX()).scaleY(value.getY());
        }
        return this;
    }

    scaled(value: IPositionable | number): IVector2D {
        return this.clone().scale(value);
    }

    magnitude(): number {
        return Math.sqrt(this.getX() ** 2 + this.getY() ** 2);
    }

    toString(): string {
        return `(${this.getX().toFixed(10)}, ${this.getY().toFixed(10)})`;
    }

    is(positionable: IVector2D): boolean {
        return this.getX() === positionable.getX() && this.getY() === positionable.getY();
    }

    eq(positionable: IVector2D): boolean {
        return this.is(positionable);
    }

    angleInRadians(): number {
        return Math.atan2(this.getY(), this.getX());
    }

    angleInDegrees(): number {
        return this.angleInRadians() * (180 / Math.PI);
    }
}
