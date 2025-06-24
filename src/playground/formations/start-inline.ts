import { IFormation } from '@/interfaces.js';

import { Formation, FormationType, Point, SPECS, Side } from '@/core.js';

import { lerp } from '@/utils.js';

export class StartInlineFormation extends Formation {
    constructor(side: Side) {
        super([], 'Start Inline Formation', side, FormationType.POINTS);

        const X1 = SPECS.GOAL_ZONE_RANGE;
        const X2 = SPECS.FIELD_CENTER_X - SPECS.FIELD_CENTER_RADIUS;
        const X3 = SPECS.FIELD_CENTER_X + SPECS.FIELD_CENTER_RADIUS;
        const X4 = SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RANGE;

        const SIDE_Xs = {
            [Side.HOME]: [X1, X2],
            [Side.AWAY]: [X4, X3],
        };

        const GK_Xs = {
            [Side.HOME]: 0,
            [Side.AWAY]: SPECS.MAX_X_COORDINATE,
        };

        const Y = SPECS.FIELD_CENTER_Y;

        for (let number = 1; number <= SPECS.MAX_PLAYERS; number++) {
            const [X1, X2] = SIDE_Xs[this.getSide()];
            const X = lerp(X1, X2, (Number(number) - 2) / (SPECS.MAX_PLAYERS - 1));
            const position = Number(number) === SPECS.GOALKEEPER_NUMBER ? new Point(GK_Xs[side], Y) : new Point(X, Y);
            this.setPositionOf(number, position);
        }
    }
}
