import { SPECS, ShotClock, Side, randomShotClock, zeroedShotClock } from '@/index.js';
import { describe, expect, test } from 'vitest';

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
                expect(s.getRemainingTurnsWithBall()).toBeLessThanOrEqual(SPECS.SHOT_CLOCK_TURNS);
            }
        });

        test('DEVE criar um shot clock com parâmetros definidos', () => {
            const s = randomShotClock({ teamSide: Side.AWAY, remainingTurns: 5 });
            expect(s.getHolderSide()).toBe(Side.AWAY);
            expect(s.getRemainingTurnsWithBall()).toBe(5);
        });
    });
});
