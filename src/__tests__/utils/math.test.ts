import { describe, expect, test } from 'vitest';

import { Point } from '@/core.js';

import { lerp2D } from '@/utils.js';

describe('Utils/Math', () => {
    test('DEVE retornar um ponto deslocado entre dois pontos', () => {
        const ts = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

        ts.forEach((t) => {
            const p1 = lerp2D(new Point(0, 0), new Point(100, 100), t);
            const p2 = lerp2D(new Point(0, 0), new Point(100, 100), t);
            expect(p1.getX()).toBeCloseTo(t * 100);
            expect(p1.getY()).toBeCloseTo(t * 100);
            expect(p2.getX()).toBeCloseTo(t * 100);
            expect(p2.getY()).toBeCloseTo(t * 100);
        });
    });
});
