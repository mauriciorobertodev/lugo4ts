import { describe, expect, test } from 'vitest';

import { Point, SPECS } from '@/core.js';

import { fieldCenterPoint, isValidInsideFieldPoint } from '@/utils.js';

describe('Utils/Field', () => {
    test('DEVE criar um novo Point representando o centro do campo', () => {
        const center = fieldCenterPoint();

        expect(center).toBeInstanceOf(Point);
        expect(center.getX()).toBe(SPECS.FIELD_CENTER_X);
        expect(center.getY()).toBe(SPECS.FIELD_CENTER_Y);
    });

    test('DEVE validar se um ponto está dentro dos limites do campo', () => {
        const validPoint = new Point(10, 20);
        const invalidPoint = new Point(-1, 20);

        expect(isValidInsideFieldPoint(validPoint)).toBe(true);
        expect(isValidInsideFieldPoint(invalidPoint)).toBe(false);
    });
});
