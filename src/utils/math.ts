import { Point } from '@/core/point.js';

import { ErrMathInterpolationFactor } from '@/errors.js';

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 *  Interpolates between two points a and b by a factor t.
 *  @param a The starting point.
 *  @param b The ending point.
 *  @param t The interpolation factor, between 0 and 1.
 *  @returns A new Point that is the result of the interpolation.
 *  @throws Error if t is not between 0 and 1.
 *  @example
 *  const pointA = new Point(0, 0);
 *  const pointB = new Point(10, 10);
 *  // Result: Point(5, 5)
 *  const interpolatedPoint = PointUtils.lerp(pointA, pointB, 0.5);
 *  @see {@link https://en.wikipedia.org/wiki/Linear_interpolation}
 */
export function lerp2D(a: Point, b: Point, t: number): Point {
    if (t < 0 || t > 1) throw new ErrMathInterpolationFactor(t);
    return new Point(lerp(a.getX(), b.getX(), t), lerp(a.getY(), b.getY(), t));
}

export function isBetween(value: number, min: number, max: number): boolean {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
}

export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
