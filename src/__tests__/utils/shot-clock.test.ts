import { describe, expect, test } from 'vitest';

import { SPECS, ShotClock, Side } from '@/core.js';

import { randomShotClock, zeroedShotClock } from '@/utils/shot-clock.js';

describe('Utils/ShotClock', () => {
    describe('Factories', () => {
        test('DEVE criar um shot clock zerado', () => {
            const s = zeroedShotClock();
            expect(s).toBeInstanceOf(ShotClock);
            expect(s.getHolderSide()).toBe(Side.HOME);
            expect(s.getRemainingTurnsWithBall()).toBe(0);
        });

        test('DEVE criar um shot clock aleatório válido', () => {
            for (let i = 0; i < 20; i++) {
                const s = randomShotClock();
                expect(s).toBeInstanceOf(ShotClock);
                expect([Side.HOME, Side.AWAY]).toContain(s.getHolderSide());
                expect(s.getRemainingTurnsWithBall()).toBeGreaterThanOrEqual(1);
                expect(s.getRemainingTurnsWithBall()).toBeLessThanOrEqual(SPECS.SHOT_CLOCK_TIME);
            }
        });

        test('DEVE criar um shot clock com parâmetros definidos', () => {
            const s = randomShotClock({ teamSide: Side.AWAY, remainingTurns: 5 });
            expect(s.getHolderSide()).toBe(Side.AWAY);
            expect(s.getRemainingTurnsWithBall()).toBe(5);
        });
    });
});
