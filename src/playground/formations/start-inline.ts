import { FormationType } from '@/interfaces/formation.js';

import { Formation } from '@/core/formation.js';
import { Point } from '@/core/point.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { lerp } from '@/utils/math.js';

export class StartInlineFormation extends Formation {
    constructor(side: Side) {
        super([], 'Start Inline Formation', side, FormationType.POINTS);

        const X1 = SPECS.GOAL_ZONE_RADIUS;
        const X2 = SPECS.CENTER_X_COORDINATE - SPECS.FIELD_CENTER_RADIUS;
        const X3 = SPECS.CENTER_X_COORDINATE + SPECS.FIELD_CENTER_RADIUS;
        const X4 = SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RADIUS;

        const SIDE_Xs = {
            [Side.HOME]: [X1, X2],
            [Side.AWAY]: [X4, X3],
        };

        const GK_Xs = {
            [Side.HOME]: 0,
            [Side.AWAY]: SPECS.MAX_X_COORDINATE,
        };

        const Y = SPECS.CENTER_Y_COORDINATE;

        for (let number = 1; number <= SPECS.MAX_PLAYERS; number++) {
            const [X1, X2] = SIDE_Xs[this.getSide()];
            const X = lerp(X1, X2, (Number(number) - 2) / (SPECS.MAX_PLAYERS - 1));
            const position = Number(number) === SPECS.GOALKEEPER_NUMBER ? new Point(GK_Xs[side], Y) : new Point(X, Y);
            this.setPositionOf(number, position);
        }
    }
}
