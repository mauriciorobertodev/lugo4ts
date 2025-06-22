import { randomInt } from 'crypto';
import { describe, expect, test } from 'vitest';

import { Mapper, Player, SPECS, Side, Team, Vector2D, Velocity } from '@/core.js';
import { Point } from '@/core/point.js';

import { randomPlayer, randomTeam } from '@/utils.js';

import { ErrTeamDuplicatePlayer, ErrTeamInvalidSide } from '@/errors.js';

describe('Core/Team', () => {
    test('DEVE criar uma instância de Team corretamente', function () {
        const side = Side.HOME;
        const players = [randomPlayer({ number: 1, side }), randomPlayer({ number: 2, side })];
        const team = new Team('TeamName', 3, side, players);

        expect(team.getName()).toBe('TeamName');
        expect(team.getScore()).toBe(3);
        expect(team.getSide()).toBe(side);
        expect(team.getPlayers()).toBe(players);
    });

    test('DEVE retornar o nome do time', function () {
        const team = new Team('TeamName', 0, Side.AWAY, []);
        expect(team.getName()).toBe('TeamName');
    });

    test('DEVE retornar a pontuação do time', function () {
        const team = new Team('TeamName', 5, Side.HOME, []);
        expect(team.getScore()).toBe(5);
    });

    test('DEVE retornar o lado do time', function () {
        const team = new Team('TeamName', 0, Side.AWAY, []);
        expect(team.getSide()).toBe(Side.AWAY);
    });

    test('DEVE retornar os jogadores do time', function () {
        const players = [randomPlayer(), randomPlayer()];
        const team = new Team('TeamName', 0, Side.HOME, players);
        expect(team.getPlayers()).toBe(players);
    });

    test('DEVE retornar verdadeiro caso o jogador X esteja no time', function () {
        const side = Side.HOME;
        const p1 = randomPlayer({ number: randomInt(1, 5), side });
        const p2 = randomPlayer({ number: randomInt(6, 11), side });

        const team = randomTeam({ players: [p1], side, populate: 0 });

        expect(team.getPlayers()).toHaveLength(1);
        expect(team.hasPlayer(p1.getNumber())).toBe(true);
        expect(team.hasPlayer(p2.getNumber())).toBe(false);
    });

    test('DEVE retornar um erro ao tentar adicionar um jogador com a side de outro time', function () {
        const side = Side.HOME;
        const p1 = randomPlayer({ number: 1, side });
        const p2 = randomPlayer({ number: 1, side: Side.AWAY });

        expect(() => new Team('TeamName', 0, side, [p1]).addPlayer(p2)).toThrow(ErrTeamInvalidSide);
        expect(() => randomTeam({ players: [p1, p2] })).toThrow(ErrTeamInvalidSide);
    });

    test('DEVE lançar erro ao tentar adicionar jogador com número duplicado', function () {
        const side = Side.HOME;
        const p1 = randomPlayer({ number: 1, side });
        const p2 = randomPlayer({ number: 1, side });

        expect(() => new Team('TeamName', 0, side, [p1, p2])).toThrow(ErrTeamDuplicatePlayer);
        expect(() => randomTeam({ side: Side.HOME, players: [p1, p2] })).toThrow(ErrTeamDuplicatePlayer);
    });
});
