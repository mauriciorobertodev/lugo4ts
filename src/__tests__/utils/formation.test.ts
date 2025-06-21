import { describe, expect, test } from 'vitest';

import { Formation, FormationType, SPECS, Side } from '@/core.js';

import { fromFormationObject, randomFormation, randomStartFormation, zeroedFormation } from '@/utils/formation.js';

describe('Utils/Formation', () => {
    describe('Factories', () => {
        test('DEVE criar uma formação zerada', () => {
            const f = zeroedFormation();
            expect(f).toBeInstanceOf(Formation);
        });

        test('DEVE criar uma formação a partir de objeto', () => {
            const obj = {
                name: 'Test',
                side: Side.HOME,
                type: FormationType.POINTS,
                positions: { 1: [10, 20] as [number, number], 2: [30, 40] as [number, number] },
                mapper: { cols: 4, rows: 2, side: Side.HOME },
            };
            const f = fromFormationObject(obj);
            expect(f).toBeInstanceOf(Formation);
            expect(f.getSide()).toBe(Side.HOME);
            expect(f.getType()).toBe(FormationType.POINTS);
            expect(f.getPositionOf(1).getX()).toBe(10);
            expect(f.getPositionOf(1).getY()).toBe(20);
            expect(f.getPositionOf(2).getX()).toBe(30);
            expect(f.getPositionOf(2).getY()).toBe(40);
        });

        test('DEVE criar uma formação aleatória válida', () => {
            for (let i = 0; i < 10; i++) {
                const f = randomFormation();
                expect(f).toBeInstanceOf(Formation);
                // Deve ter pelo menos 1 jogador
                let count = 0;
                for (let n = 1; n <= SPECS.MAX_PLAYERS; n++) {
                    if (f.getPositionOf(n)) count++;
                }
                expect(count).toBeGreaterThanOrEqual(1);
            }
        });

        test('DEVE criar uma formação inicial aleatória', () => {
            const f = randomStartFormation(Side.AWAY);
            expect(f).toBeInstanceOf(Formation);
            for (let n = 1; n <= SPECS.MAX_PLAYERS; n++) {
                const pos = f.getPositionOf(n);
                expect(pos).toBeDefined();
                expect(pos.getX()).toBeGreaterThanOrEqual(0);
                expect(pos.getY()).toBeGreaterThanOrEqual(0);
            }
        });
    });
});
