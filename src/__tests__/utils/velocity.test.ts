import { SPECS, Vector2D, Velocity, randomVelocity, zeroedVelocity } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Utils/Velocity', () => {
    describe('Factories', () => {
        test('DEVE criar uma velocidade zerada', () => {
            const v = zeroedVelocity();
            expect(v).toBeInstanceOf(Velocity);
            expect(v.getDirection().getX()).toBe(0);
            expect(v.getDirection().getY()).toBe(0);
            expect(v.getSpeed()).toBe(0);
        });

        test('DEVE criar uma velocidade aleatória com direção normalizada e speed dentro do range', () => {
            for (let i = 0; i < 100; i++) {
                const v = randomVelocity();
                expect(v).toBeInstanceOf(Velocity);
                // direção normalizada (módulo 1 ou 0)
                const dir = v.getDirection();
                const length = Math.sqrt(dir.getX() ** 2 + dir.getY() ** 2);
                expect(length === 0 || Math.abs(length - 1) < 1e-6).toBe(true);
                // speed dentro do range
                expect(v.getSpeed()).toBeGreaterThanOrEqual(0);
                expect(v.getSpeed()).toBeLessThanOrEqual(SPECS.PLAYER_MAX_SPEED);
            }
        });

        test('DEVE criar uma velocidade com direção e speed definidos', () => {
            const direction = new Vector2D(1, 0);
            const speed = 5;
            const v = randomVelocity({ direction, speed });
            expect(v.getDirection().getX()).toBe(1);
            expect(v.getDirection().getY()).toBe(0);
            expect(v.getSpeed()).toBe(speed);
        });
    });
});
