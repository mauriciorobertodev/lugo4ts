import { SPECS, ShotClock, Side } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Core/ShotClock', () => {
    test('DEVE retornar o número correto de turnos restantes com a bola', function () {
        const shotClock = new ShotClock(Side.HOME, 10);

        expect(shotClock.getRemainingTurnsWithBall()).toBe(10);
    });

    test('DEVE retornar o número correto de turnos passados com a bola', function () {
        const shotClock = new ShotClock(Side.HOME, 5);

        expect(shotClock.getTurnsWithBall()).toBe(SPECS.SHOT_CLOCK_TURNS - 5);
    });

    test('DEVE retornar o lado correto do detentor da bola', function () {
        const shotClock = new ShotClock(Side.HOME, 10);

        expect(shotClock.getHolderSide()).toBe(Side.HOME);
    });
});
