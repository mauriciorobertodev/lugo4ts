import { Formation, FormationType, Mapper, Point, Side, randomMapper } from '@/index.js';
import { describe, expect, test } from 'vitest';

import { ErrFormationMapperNotDefined, ErrFormationPlayerPositionNotDefined } from '@/errors.js';

describe('Core/Formation', () => {
    test('Getters e Setters', () => {
        const f = new Formation();

        expect(f.getPositions()).toEqual({});
        expect(f.hasPositionOf(1)).toBe(false);
        expect(f.tryGetPositionOf(1)).toBeNull();
        f.setPositionOf(1, new Point(10, 20));
        expect(f.getPositionOf(1)).toEqual(new Point(10, 20));
        expect(f.getPositions()).toEqual({ 1: new Point(10, 20) });
        expect(f.hasPositionOf(1)).toBe(true);

        expect(f.isRegions()).toBe(false);

        expect(f.toArray()).toEqual([new Point(10, 20)]);

        expect(f.setName('Test Formation')).toBe(f);
        expect(f.getName()).toBe('Test Formation');

        expect(f.getSide()).toBe(Side.HOME);
        f.setSide(Side.AWAY);
        expect(f.getSide()).toBe(Side.AWAY);

        const m = randomMapper();
        expect(f.setMapper(m)).toBe(f);
        expect(f.getMapper()).toBe(m);

        expect(f.getType()).toBe(FormationType.POINTS);
        f.setType(FormationType.REGIONS);
        expect(f.getType()).toBe(FormationType.REGIONS);
        expect(f.isRegions()).toBe(true);

        expect(f.hasPositionOf(1)).toBe(true);
        expect(f.hasPositionOf(2)).toBe(false);

        expect(() => f.getPositionOf(10)).toThrowError(ErrFormationPlayerPositionNotDefined);
    });

    test('DEVE deve alterar também a side do mapper quando existe', () => {
        const m = randomMapper({ side: Side.HOME });
        const f = new Formation([], 'Test Formation', Side.HOME, FormationType.REGIONS, m);

        expect(f.getSide()).toBe(m.getSide());

        f.setSide(Side.AWAY);
        expect(f.getSide()).toBe(Side.AWAY);
        expect(m.getSide()).toBe(Side.AWAY);
    });

    test('DEVE retornar o centro de uma região quando o tipo for REGIONS', () => {
        const m = new Mapper(10, 10, Side.HOME);
        const f = new Formation([], 'Test Formation', Side.HOME, FormationType.REGIONS, m);

        f.setPositionOf(1, new Point(1, 2));
        f.setPositionOf(2, new Point(2, 3));

        expect(f.getPositionOf(1)).toEqual(m.getRegion(1, 2).getCenter());
    });

    test('DEVE lançar um erro ao tentar pegar o mapper de uma formação sem mapper', () => {
        const f = new Formation([], 'Test Formation', Side.HOME, FormationType.POINTS);
        expect(() => f.getMapper()).toThrow(ErrFormationMapperNotDefined);
    });
});
