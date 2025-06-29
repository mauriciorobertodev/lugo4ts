import { Mapper, Side, createMapperFromObject, randomMapper, zeroedMapper } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('Utils/Mapper', () => {
    describe('Converters', () => {
        test('DEVE criar um Mapper a partir de um objeto', () => {
            const obj = { cols: 10, rows: 5, side: Side.AWAY };
            const m = createMapperFromObject(obj);
            expect(m).toBeInstanceOf(Mapper);
            expect(m.getCols()).toBe(10);
            expect(m.getRows()).toBe(5);
            expect(m.getSide()).toBe(Side.AWAY);
        });
    });

    describe('Factories', () => {
        test('DEVE criar um Mapper zerado', () => {
            const m = zeroedMapper();
            expect(m).toBeInstanceOf(Mapper);
            expect(m.getCols()).toBe(4);
            expect(m.getRows()).toBe(2);
            expect(m.getSide()).toBe(Side.HOME);
        });

        test('DEVE criar um Mapper aleatório válido', () => {
            for (let i = 0; i < 20; i++) {
                const m = randomMapper();
                expect(m).toBeInstanceOf(Mapper);
                expect(m.getCols()).toBeGreaterThanOrEqual(4);
                expect(m.getCols()).toBeLessThanOrEqual(200);
                expect(m.getRows()).toBeGreaterThanOrEqual(2);
                expect(m.getRows()).toBeLessThanOrEqual(100);
                expect([Side.HOME, Side.AWAY]).toContain(m.getSide());
            }
        });
    });
});
