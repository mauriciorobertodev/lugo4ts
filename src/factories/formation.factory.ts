import { ErrFormationInvalidType } from '../core/errors.js';
import { FormationType } from '../core/formation.js';

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
