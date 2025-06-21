import { describe, expect, test } from 'vitest';

import { Goal, Point, Side } from '@/core.js';

describe('Core/Goal', () => {
    test('DEVE ser possível criar um gol para ambas as sides, com os poles corretos', () => {
        const homeGoalTop = new Point(1, 2);
        const homeGoalCenter = new Point(3, 4);
        const homeGoalBottom = new Point(5, 6);
        const homeGoal = new Goal(Side.HOME, homeGoalCenter, homeGoalTop, homeGoalBottom);

        expect(homeGoal.getSide()).toBe(Side.HOME);
        expect(homeGoal.getTopPole().getX()).toBe(1);
        expect(homeGoal.getCenter().getX()).toBe(3);
        expect(homeGoal.getBottomPole().getX()).toBe(5);
        expect(homeGoal.getTopPole().getY()).toBe(2);
        expect(homeGoal.getCenter().getY()).toBe(4);
        expect(homeGoal.getBottomPole().getY()).toBe(6);

        const awayGoalTop = new Point(7, 8);
        const awayGoalCenter = new Point(9, 10);
        const awayGoalBottom = new Point(11, 12);
        const awayGoal = new Goal(Side.AWAY, awayGoalCenter, awayGoalTop, awayGoalBottom);

        expect(awayGoal.getSide()).toBe(Side.AWAY);
        expect(awayGoal.getTopPole().getX()).toBe(7);
        expect(awayGoal.getCenter().getX()).toBe(9);
        expect(awayGoal.getBottomPole().getX()).toBe(11);
        expect(awayGoal.getTopPole().getY()).toBe(8);
        expect(awayGoal.getCenter().getY()).toBe(10);
        expect(awayGoal.getBottomPole().getY()).toBe(12);
    });
});
