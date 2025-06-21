import { describe, expect, test } from 'vitest';

import { Vector2D } from '@/core.js';

import { randomVector2D, vector2DToPoint, zeroedVector } from '@/utils/vector.js';

describe('Utils/Vector', () => {
    describe('Converters', () => {
        test('DEVE converter um Vector2D para um Point', () => {
            const v = new Vector2D(3, 4);
            const p = vector2DToPoint(v);
            expect(p.getX()).toBe(v.getX());
            expect(p.getY()).toBe(v.getY());
        });
    });

    describe('Factories', () => {
        test('DEVE criar um vetor zerado', () => {
            const v = zeroedVector();
            expect(v.getX()).toBe(0);
            expect(v.getY()).toBe(0);
        });

        test('DEVE criar um vetor aleatório normalizado', () => {
            for (let i = 0; i < 100; i++) {
                const v = randomVector2D();
                // O vetor deve ser normalizado (módulo 1 ou 0)
                const length = Math.sqrt(v.getX() ** 2 + v.getY() ** 2);
                expect(length === 0 || Math.abs(length - 1) < 1e-6).toBe(true);
            }
        });
    });
});
