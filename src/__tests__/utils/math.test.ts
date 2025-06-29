import { Point, isBetween, lerp2D, randomInt } from '@/index.js';
import { describe, expect, test } from 'vitest';

import { ErrMathInterpolationFactor } from '@/errors.js';

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

    test('DEVE lançar um erro se o fator de interpolação não estiver entre 0 e 1', () => {
        expect(() => lerp2D(new Point(0, 0), new Point(100, 100), -0.1)).toThrow(ErrMathInterpolationFactor);
        expect(() => lerp2D(new Point(0, 0), new Point(100, 100), 1.1)).toThrow(ErrMathInterpolationFactor);
    });

    test('DEVE retornar se um número está dentre outros dois', () => {
        for (let i = 0; i < 100; i++) {
            const min = randomInt(1, 1000);
            const max = randomInt(1, 1000);
            const number = randomInt(min, max);
            const is = isBetween(number, min, max);
            expect(is).toBe(true);
        }
    });
});
