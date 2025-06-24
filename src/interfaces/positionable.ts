export interface IPositionable {
    getX(): number;
    setX(x: number): this;
    addX(value: number): this;
    subtractX(value: number): this;
    scaleX(value: number): this;
    divideX(value: number): this;

    getY(): number;
    setY(y: number): this;
    addY(value: number): this;
    subtractY(value: number): this;
    scaleY(value: number): this;
    divideY(value: number): this;

    magnitude(): number;

    normalize(): this;

    add(value: IPositionable | number): this;
    subtract(value: IPositionable | number): this;
    divide(value: IPositionable | number): this;
    scale(value: IPositionable | number): this;

    // normalized(): IPositionable;
    // added(value: IPositionable | number): IPositionable;
    // subtracted(value: IPositionable | number): IPositionable;
    // divided(value: IPositionable | number): IPositionable;
    // scaled(value: IPositionable | number): IPositionable;

    toString(): string;
}

export interface IVector2D extends IPositionable {
    eq(positionable: IVector2D): boolean;
    is(positionable: IVector2D): boolean;

    clone(): IVector2D;

    normalized(): IVector2D;

    added(value: IPositionable | number): IVector2D;
    subtracted(value: IPositionable | number): IVector2D;
    divided(value: IPositionable | number): IVector2D;
    scaled(value: IPositionable | number): IVector2D;

    angleInRadians(): number;
    angleInDegrees(): number;
}

export interface IPoint extends IPositionable {
    eq(positionable: IPoint): boolean;
    is(positionable: IPoint): boolean;

    clone(): IPoint;

    directionTo(to: IPoint): IVector2D;

    distanceTo(to: IPoint): number;

    moveToDirection(direction: IVector2D, distance: number): this;
    movedToDirection(direction: IVector2D, distance: number): IPoint;

    moveToPoint(point: IPoint, distance: number): this;
    movedToPoint(point: IPoint, distance: number): IPoint;

    normalized(): IPoint;

    added(value: IPositionable | number): IPoint;
    subtracted(value: IPositionable | number): IPoint;
    divided(value: IPositionable | number): IPoint;
    scaled(value: IPositionable | number): IPoint;
}
