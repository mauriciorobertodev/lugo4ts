import { describe, expect, test } from 'vitest';

import { Mapper, Player, SPECS, Side, Vector2D, Velocity } from '@/core.js';
import { Point } from '@/core/point.js';

describe('Core/Specs', () => {
    test('DEVE ter a constante BASE_UNIT igual a 100', function () {
        expect(SPECS.BASE_UNIT).toBe(100);
    });

    test('DEVE calcular PLAYER_SIZE como 4 vezes BASE_UNIT', function () {
        expect(SPECS.PLAYER_SIZE).toBe(4 * SPECS.BASE_UNIT);
    });

    test('DEVE calcular PLAYER_RADIUS como metade do PLAYER_SIZE', function () {
        expect(SPECS.PLAYER_RADIUS).toBe(SPECS.PLAYER_SIZE / 2);
    });

    test('DEVE ter PLAYER_RECONNECTION_WAIT_TIME igual a 20', function () {
        expect(SPECS.PLAYER_RECONNECTION_WAIT_TIME).toBe(20);
    });

    test('DEVE ter MAX_PLAYERS igual a 11', function () {
        expect(SPECS.MAX_PLAYERS).toBe(11);
    });

    test('DEVE ter MIN_PLAYERS igual a 6', function () {
        expect(SPECS.MIN_PLAYERS).toBe(6);
    });

    test('DEVE ter PLAYER_MAX_SPEED igual a 100.0', function () {
        expect(SPECS.PLAYER_MAX_SPEED).toBe(100.0);
    });

    test('DEVE calcular MAX_X_COORDINATE como 200 vezes BASE_UNIT', function () {
        expect(SPECS.MAX_X_COORDINATE).toBe(200 * SPECS.BASE_UNIT);
    });

    test('DEVE calcular MAX_Y_COORDINATE como 100 vezes BASE_UNIT', function () {
        expect(SPECS.MAX_Y_COORDINATE).toBe(100 * SPECS.BASE_UNIT);
    });

    test('DEVE calcular BALL_SIZE como 2 vezes BASE_UNIT', function () {
        expect(SPECS.BALL_SIZE).toBe(2 * SPECS.BASE_UNIT);
    });

    test('DEVE ter BALL_DECELERATION igual a 10.0', function () {
        expect(SPECS.BALL_DECELERATION).toBe(10.0);
    });

    test('DEVE calcular BALL_MAX_SPEED como 4 vezes BASE_UNIT', function () {
        expect(SPECS.BALL_MAX_SPEED).toBe(4.0 * SPECS.BASE_UNIT);
    });

    test('DEVE ter BALL_MIN_SPEED igual a 2', function () {
        expect(SPECS.BALL_MIN_SPEED).toBe(2);
    });

    test('DEVE calcular GOAL_WIDTH como 30 vezes BASE_UNIT', function () {
        expect(SPECS.GOAL_WIDTH).toBe(30 * SPECS.BASE_UNIT);
    });

    test('DEVE calcular GOAL_MIN_Y corretamente', function () {
        expect(SPECS.GOAL_MIN_Y).toBe((100 * SPECS.BASE_UNIT - 30 * SPECS.BASE_UNIT) / 2);
    });

    test('DEVE calcular GOAL_MAX_Y corretamente', function () {
        expect(SPECS.GOAL_MAX_Y).toBe((100 * SPECS.BASE_UNIT - 30 * SPECS.BASE_UNIT) / 2 + 30 * SPECS.BASE_UNIT);
    });

    test('DEVE calcular FIELD_WIDTH como 200 vezes BASE_UNIT + 1', function () {
        expect(SPECS.FIELD_WIDTH).toBe(200 * SPECS.BASE_UNIT + 1);
    });

    test('DEVE calcular FIELD_HEIGHT como 100 vezes BASE_UNIT + 1', function () {
        expect(SPECS.FIELD_HEIGHT).toBe(100 * SPECS.BASE_UNIT + 1);
    });
});
