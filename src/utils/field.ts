// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------
import { Point } from '@/core/point.js';
import { SPECS } from '@/core/specs.js';

/**
 * Creates a new Point with the given coordinates.
 */
export function fieldCenterPoint(): Point {
    return new Point(SPECS.CENTER_X_COORDINATE, SPECS.CENTER_Y_COORDINATE);
}

// ------------------------------------------------------------
// Validators
// ------------------------------------------------------------

/**
 * Checks if the given point is valid inside the field.
 * A point is valid if its coordinates are within the field boundaries defined by SPECS.
 * @param point The point to check.
 * @returns True if the point is valid, false otherwise.
 * @example
 * isValidInsideFieldPoint(new Point(10, 20)); // true
 * isValidInsideFieldPoint(new Point(-1, 20)); // false
 */
export function isValidInsideFieldPoint(point: Point): boolean {
    return (
        point.getX() >= 0 &&
        point.getX() <= SPECS.MAX_X_COORDINATE &&
        point.getY() >= 0 &&
        point.getY() <= SPECS.MAX_Y_COORDINATE
    );
}
