import { describe, expect, test } from 'vitest';

import { Ball, SPECS } from '@/core.js';

import { randomBall, zeroedBall } from '@/utils.js';

describe('Utils/Ball', () => {
    describe('Factories', () => {
        test('DEVE criar uma bola zerada', () => {
            const b = zeroedBall();
            expect(b).toBeInstanceOf(Ball);
            expect(b.getPosition().getX()).toBeGreaterThanOrEqual(0);
            expect(b.getPosition().getY()).toBeGreaterThanOrEqual(0);
            expect(b.getVelocity().getSpeed()).toBe(0);
            expect(b.getHolder()).toBeNull();
        });

        test('DEVE criar uma bola aleatória válida', () => {
            for (let i = 0; i < 20; i++) {
                const b = randomBall();
                expect(b).toBeInstanceOf(Ball);
                expect(b.getPosition().getX()).toBeGreaterThanOrEqual(0);
                expect(b.getPosition().getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE);
                expect(b.getPosition().getY()).toBeGreaterThanOrEqual(0);
                expect(b.getPosition().getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);
                expect(b.getVelocity().getSpeed()).toBeGreaterThanOrEqual(0);
                expect(b.getVelocity().getSpeed()).toBeLessThanOrEqual(SPECS.BALL_MAX_SPEED);
            }
        });

        test('DEVE criar uma bola com parâmetros definidos', () => {
            const b = randomBall({ speed: 5, maxSpeed: 10 });
            expect(b.getVelocity().getSpeed()).toBe(5);
        });
    });
});
