import { describe, expect, test } from 'vitest';

import { Side, Team } from '@/core.js';

import { randomPlayer } from '@/utils.js';
import { randomTeam, zeroedTeam } from '@/utils/team.js';

import { ErrTeamInvalidSide } from '@/errors.js';

function getPlayerSide(p: any) {
    return typeof p.getTeamSide === 'function'
        ? p.getTeamSide()
        : typeof p.getSide === 'function'
          ? p.getSide()
          : undefined;
}

describe('Utils/Team', () => {
    describe('Factories', () => {
        test('DEVE criar um time zerado', () => {
            const t = zeroedTeam();
            expect(t).toBeInstanceOf(Team);
            expect(t.getName()).toBe('Zeroed Team');
            expect(t.getScore()).toBe(0);
            expect(t.getSide()).toBe(Side.HOME);
            expect(Array.isArray(t.getPlayers())).toBe(true);
            expect(t.getPlayers().length).toBe(0);
        });

        test('DEVE criar um time aleatório válido', () => {
            for (let i = 0; i < 20; i++) {
                const p1 = randomPlayer({ number: 1, side: Side.HOME });
                const t = randomTeam({ players: [p1], side: Side.HOME });

                expect(t).toBeInstanceOf(Team);
                expect([Side.HOME, Side.AWAY]).toContain(t.getSide());
                expect(Array.isArray(t.getPlayers())).toBe(true);
                expect(t.getPlayers().length).toBe(11);
                t.getPlayers().forEach((p, idx) => {
                    expect(getPlayerSide(p)).toBe(t.getSide());
                    expect(p.getNumber()).toBe(idx + 1);
                });
            }
        });

        test('DEVE criar um time com parâmetros definidos', () => {
            const t = randomTeam({ name: 'Dream Team', side: Side.AWAY, score: 3, populate: 5 });
            expect(t.getName()).toBe('Dream Team');
            expect(t.getSide()).toBe(Side.AWAY);
            expect(t.getScore()).toBe(3);
            expect(t.getPlayers().length).toBe(5);
        });

        test('DEVE lançar erro ao criar time com jogadores de lados diferentes', () => {
            expect(() => {
                randomTeam({
                    players: [
                        randomPlayer({ number: 1, side: Side.HOME }),
                        randomPlayer({ number: 2, side: Side.AWAY }),
                    ],
                });
            }).toThrow(ErrTeamInvalidSide);
        });

        test('DEVE lançar erro ao criar time com jogadores duplicados', () => {
            expect(() => {
                randomTeam({
                    players: [
                        randomPlayer({ number: 1, side: Side.HOME }),
                        randomPlayer({ number: 1, side: Side.HOME }),
                    ],
                });
            }).toThrow();
        });
    });
});
