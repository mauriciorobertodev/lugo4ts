import { describe, expect, test } from 'vitest';

import { Goal, Point, Side } from '@/core.js';

describe('Core/Env', () => {
    test('DEVE construir um gol customizado', function () {
        const center = new Point(10, 20);
        const topPole = new Point(10, 30);
        const bottomPole = new Point(10, 10);
        const goal = new Goal(Side.HOME, center, topPole, bottomPole);

        expect(goal.getSide()).toBe(Side.HOME);
        expect(goal.getCenter()).toEqual(center);
        expect(goal.getTopPole()).toEqual(topPole);
        expect(goal.getBottomPole()).toEqual(bottomPole);
    });
});
