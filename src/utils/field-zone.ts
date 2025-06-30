// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------
import { FieldZoneObject } from '@/interfaces/field-zone.js';

import { FieldZone } from '@/core/field-zone.js';

import { fromFormationObject } from './formation.js';
import { randomUUID } from './random.js';

export function fromFieldZoneObject({
    id = randomUUID(),
    name = '?????',
    start,
    end,
    formation,
}: FieldZoneObject): FieldZone {
    return new FieldZone(name, start.col, end.col, start.row, end.row, fromFormationObject(formation), id);
}
