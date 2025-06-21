import { describe, expect, test } from 'vitest';

import { AWAY_GOAL, HOME_GOAL, Point, SPECS, Side, Vector2D } from '@/core.js';

import {
    fieldCenterPoint,
    isValidInitialPosition,
    pointToVector2D,
    randomInitialPosition,
    randomPoint,
    randomPointBetween,
    randomPointBetweenGoalPoles,
    randomPointInSide,
} from '@/utils.js';

describe('Utils/Point', () => {
    describe('Converters', () => {
        test('DEVE converter um Point para um Vector2D', () => {
            const p = new Point(100, 200);
            const v = pointToVector2D(p);

            expect(v).toBeInstanceOf(Vector2D);
            expect(v.getX()).toBe(p.getX());
            expect(v.getY()).toBe(p.getY());
        });
    });

    describe('Factories', () => {
        test('DEVE criar um novo Point aleatório', () => {
            for (let i = 0; i < 100; i++) {
                const minX = -1000;
                const minY = -1000;
                const maxX = 1000;
                const maxY = 1000;
                const p = randomPoint({ minX, minY, maxX, maxY });

                expect(p.getX()).toBeGreaterThanOrEqual(minX);
                expect(p.getX()).toBeLessThanOrEqual(maxX);
                expect(p.getY()).toBeGreaterThanOrEqual(minY);
                expect(p.getY()).toBeLessThanOrEqual(maxY);
            }
        });

        test('DEVE criar um novo Point aleatório dentro do campo', () => {
            for (let i = 0; i < 100; i++) {
                const p = randomPoint();

                expect(p.getX()).toBeGreaterThanOrEqual(0);
                expect(p.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE);
                expect(p.getY()).toBeGreaterThanOrEqual(0);
                expect(p.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);
            }
        });

        test('DEVE criar um novo Point dentro da side correta', () => {
            for (let i = 0; i < 100; i++) {
                const p1 = randomPointInSide(Side.HOME);

                expect(p1.getX()).toBeGreaterThanOrEqual(0);
                expect(p1.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE / 2);
                expect(p1.getY()).toBeGreaterThanOrEqual(0);
                expect(p1.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                const p2 = randomPointInSide(Side.AWAY);
                expect(p2.getX()).toBeGreaterThanOrEqual(SPECS.MAX_X_COORDINATE / 2);
                expect(p2.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE);
                expect(p2.getY()).toBeGreaterThanOrEqual(0);
                expect(p2.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                expect(p1.getX()).not.toEqual(p2.getX());
                expect(p1.getY()).not.toEqual(p2.getY());
            }
        });

        test('DEVE criar um novo Point inicial aleatório dentro da side correta', () => {
            for (let i = 0; i < 100; i++) {
                const p1 = randomInitialPosition(Side.HOME);
                const p2 = randomInitialPosition(Side.AWAY);

                expect(isValidInitialPosition(p1)).toBe(true);
                expect(isValidInitialPosition(p2)).toBe(true);

                // DEVE estar dentro do campo
                expect(p1.getX()).toBeGreaterThanOrEqual(0);
                expect(p1.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE / 2 - 1);
                expect(p1.getY()).toBeGreaterThanOrEqual(0);
                expect(p1.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                expect(p2.getX()).toBeGreaterThanOrEqual(SPECS.MAX_X_COORDINATE / 2);
                expect(p2.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE - 1);
                expect(p2.getY()).toBeGreaterThanOrEqual(0);
                expect(p2.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                // DEVE estar fora do círculo central
                expect(p1.distanceTo(fieldCenterPoint())).toBeGreaterThan(SPECS.FIELD_CENTER_RADIUS);
                expect(p2.distanceTo(fieldCenterPoint())).toBeGreaterThan(SPECS.FIELD_CENTER_RADIUS);

                // DEVE estar fora do círculo dos polos do gol
                const homeGoal = HOME_GOAL;
                const awayGoal = AWAY_GOAL;

                expect(p1.distanceTo(homeGoal.getTopPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getTopPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                expect(p1.distanceTo(homeGoal.getCenter())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getCenter())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                expect(p1.distanceTo(homeGoal.getBottomPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getBottomPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                //
                // SE estiver com o Y entre os polos gol ele deve estar fora do range da zona de gol
                if (p1.getY() >= homeGoal.getTopPole().getY() && p1.getY() <= homeGoal.getBottomPole().getY()) {
                    expect(p1.getX()).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                }
                if (p2.getY() >= awayGoal.getTopPole().getY() && p2.getY() <= awayGoal.getBottomPole().getY()) {
                    expect(p2.getX()).toBeLessThan(SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RANGE);
                }
            }
        });

        test('DEVE criar um ponto aleatório entre dois pontos', () => {
            const A = new Point(0, 0);
            const B = new Point(100, 100);

            for (let i = 0; i < 100; i++) {
                const p1 = randomPointBetween(A, B);
                const p2 = randomPointBetween(A, B);

                const randomPoint = randomPointBetween(p1, p2);

                expect(randomPoint.getX()).toBeGreaterThanOrEqual(Math.min(p1.getX(), p2.getX()));
                expect(randomPoint.getX()).toBeLessThanOrEqual(Math.max(p1.getX(), p2.getX()));
                expect(randomPoint.getY()).toBeGreaterThanOrEqual(Math.min(p1.getY(), p2.getY()));
                expect(randomPoint.getY()).toBeLessThanOrEqual(Math.max(p1.getY(), p2.getY()));
            }
        });

        test('DEVE criar um ponto aleatório entre os polos de um gol', () => {
            const homeGoal = HOME_GOAL;
            const awayGoal = AWAY_GOAL;

            for (let i = 0; i < 100; i++) {
                const p1 = randomPointBetweenGoalPoles(homeGoal);
                const p2 = randomPointBetweenGoalPoles(awayGoal);

                expect(p1.getX()).toBe(homeGoal.getTopPole().getX());
                expect(p2.getX()).toBe(awayGoal.getTopPole().getX());

                expect(p1.getY()).toBeLessThanOrEqual(homeGoal.getTopPole().getY());
                expect(p1.getY()).toBeGreaterThanOrEqual(homeGoal.getBottomPole().getY());

                expect(p2.getY()).toBeLessThanOrEqual(awayGoal.getTopPole().getY());
                expect(p2.getY()).toBeGreaterThanOrEqual(awayGoal.getBottomPole().getY());
            }
        });
    });

    describe('Validators', () => {
        test('DEVE validar se um Point é uma posição inicial válida', () => {
            for (let i = 0; i < 100; i++) {
                const p1 = randomInitialPosition(Side.HOME);
                const p2 = randomInitialPosition(Side.AWAY);

                expect(isValidInitialPosition(p1)).toBe(true);
                expect(isValidInitialPosition(p2)).toBe(true);

                // DEVE estar dentro do campo
                expect(p1.getX()).toBeGreaterThanOrEqual(0);
                expect(p1.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE / 2 - 1);
                expect(p1.getY()).toBeGreaterThanOrEqual(0);
                expect(p1.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                expect(p2.getX()).toBeGreaterThanOrEqual(SPECS.MAX_X_COORDINATE / 2);
                expect(p2.getX()).toBeLessThanOrEqual(SPECS.MAX_X_COORDINATE - 1);
                expect(p2.getY()).toBeGreaterThanOrEqual(0);
                expect(p2.getY()).toBeLessThanOrEqual(SPECS.MAX_Y_COORDINATE);

                // DEVE estar fora do círculo central
                expect(p1.distanceTo(fieldCenterPoint())).toBeGreaterThan(SPECS.FIELD_CENTER_RADIUS);
                expect(p2.distanceTo(fieldCenterPoint())).toBeGreaterThan(SPECS.FIELD_CENTER_RADIUS);

                // DEVE estar fora do círculo dos polos do gol
                const homeGoal = HOME_GOAL;
                const awayGoal = AWAY_GOAL;

                expect(p1.distanceTo(homeGoal.getTopPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getTopPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                expect(p1.distanceTo(homeGoal.getCenter())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getCenter())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                expect(p1.distanceTo(homeGoal.getBottomPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                expect(p2.distanceTo(awayGoal.getBottomPole())).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);

                // SE estiver com o Y entre os polos gol ele deve estar fora do range da zona de gol
                if (p1.getY() >= homeGoal.getTopPole().getY() && p1.getY() <= homeGoal.getBottomPole().getY()) {
                    expect(p1.getX()).toBeGreaterThan(SPECS.GOAL_ZONE_RANGE);
                }

                if (p2.getY() >= awayGoal.getTopPole().getY() && p2.getY() <= awayGoal.getBottomPole().getY()) {
                    expect(p2.getX()).toBeLessThan(SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RANGE);
                }
            }
        });
    });
});
