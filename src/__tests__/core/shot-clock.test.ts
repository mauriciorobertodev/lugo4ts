import { describe, expect, test } from 'vitest';

import { Mapper, Player, SPECS, ShotClock, Side, Vector2D, Velocity } from '@/core.js';

describe('Core/ShotClock', () => {
    test('DEVE retornar o número correto de turnos restantes com a bola', function () {
        const shotClock = new ShotClock(Side.HOME, 10);

        expect(shotClock.getRemainingTurnsWithBall()).toBe(10);
    });

    test('DEVE retornar o número correto de turnos passados com a bola', function () {
        const shotClock = new ShotClock(Side.HOME, 5);

        expect(shotClock.getTurnsWithBall()).toBe(SPECS.SHOT_CLOCK_TIME - 5);
    });

    test('DEVE retornar o lado correto do detentor da bola', function () {
        const shotClock = new ShotClock(Side.HOME, 10);

        expect(shotClock.getHolderSide()).toBe(Side.HOME);
    });
});
