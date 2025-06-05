import { ErrFormationInvalidType } from '../core/errors.js';
import { Formation, FormationType } from '../core/formation.js';
import { Point } from '../core/point.js';
import { SPECS } from '../core/specs.js';

export class FormationTypeFactory {
    static fromString(value: string): FormationType {
        switch (value.toLowerCase()) {
            case 'regions':
                return FormationType.REGIONS;
            case 'points':
                return FormationType.POINTS;
            case '':
                return FormationType.NOT_DEFINED;
            default:
                throw new ErrFormationInvalidType(value);
        }
    }
}

export class FormationFactory {
    static createFromObject(object: Record<number, { col: number; row: number }>) {
        const formation = FormationFactory.createZeroed();

        for (const keyStr in object) {
            const key = parseInt(keyStr, 10);

            if (isNaN(key) || key < 1 || key > SPECS.MAX_PLAYERS) {
                throw new ErrFormationInvalidType(keyStr);
            }

            const value = object[key];

            formation.definePositionOf(key, value.col, value.row);
        }

        return formation;
    }

    static createZeroed() {
        const positions: { [index: number]: Point } = {};

        for (let i = 1; i <= SPECS.MAX_PLAYERS; i++) {
            positions[i] = new Point(); // ou new Point(0, 0) se precisar de valores
        }

        return new Formation(positions);
    }
}
