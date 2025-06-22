import { randomInt } from 'crypto';
import { describe, expect, test } from 'vitest';

import { Mapper, Player, SPECS, Side, Team, Vector2D, Velocity } from '@/core.js';
import { Point } from '@/core/point.js';

import { randomPlayer, randomTeam } from '@/utils.js';

import {
    ErrPlayerNotFound,
    ErrTeamDuplicatePlayer,
    ErrTeamEmpty,
    ErrTeamInvalidScore,
    ErrTeamInvalidSide,
} from '@/errors.js';

describe('Core/Team', () => {
    test('Getters e Setters', () => {
        const team = new Team('Test Team', 0, Side.HOME, []);
        expect(team.getName()).toBe('Test Team');
        expect(team.getScore()).toBe(0);
        expect(team.getSide()).toBe(Side.HOME);
        expect(team.getPlayers()).toEqual([]);

        team.setName('New Team Name');
        expect(team.getName()).toBe('New Team Name');

        team.incrementScore();
        expect(team.getScore()).toBe(1);

        team.decrementScore();
        expect(team.getScore()).toBe(0);

        team.setScore(5);
        expect(team.getScore()).toBe(5);

        team.resetScore();
        expect(team.getScore()).toBe(0);

        team.setSide(Side.AWAY);
        expect(team.getSide()).toBe(Side.AWAY);

        const player1 = randomPlayer({ number: 1, side: Side.AWAY });
        const player2 = randomPlayer({ number: 2, side: Side.AWAY });
        team.addPlayer(player1);
        team.addPlayer(player2);
        expect(team.getPlayers()).toEqual([player1, player2]);
        expect(team.getPlayersCount()).toBe(2);

        expect(() => team.setScore(-1)).toThrow(ErrTeamInvalidScore);
    });

    test('DEVE criar uma instância de Team corretamente', function () {
        const side = Side.HOME;
        const players = [randomPlayer({ number: 1, side }), randomPlayer({ number: 2, side })];
        const team = new Team('TeamName', 3, side, players);

        expect(team.getName()).toBe('TeamName');
        expect(team.getScore()).toBe(3);
        expect(team.getSide()).toBe(side);
        expect(team.getPlayers()).toBe(players);
    });

    test('DEVE lançar um erro se a pontuação for negativa', function () {
        expect(() => new Team('TeamName', -1, Side.HOME, [])).toThrow(ErrTeamInvalidScore);
    });

    test('DEVE lançar um erro se um jogador tiver a side diferente do time', function () {
        const side = Side.HOME;
        const player = randomPlayer({ number: 1, side: Side.AWAY });
        expect(() => new Team('TeamName', 0, side, [player])).toThrow(ErrTeamInvalidSide);
    });

    test('DEVE lançar um erro se houver jogadores com números duplicados', function () {
        const side = Side.HOME;
        const player1 = randomPlayer({ number: 1, side });
        const player2 = randomPlayer({ number: 1, side });
        expect(() => new Team('TeamName', 0, side, [player1, player2])).toThrow(ErrTeamDuplicatePlayer);
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
        const players = [randomPlayer({ number: 1, side: Side.HOME }), randomPlayer({ number: 2, side: Side.HOME })];
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

    test('DEVE retornar um jogador aleatório do time', function () {
        const side = Side.HOME;
        const players = [
            randomPlayer({ number: 1, side }),
            randomPlayer({ number: 2, side }),
            randomPlayer({ number: 3, side }),
        ];
        const team = new Team('TeamName', 0, side, players);

        expect(team.getRandomPlayer()).toBeInstanceOf(Player);
        expect(players).toContain(team.getRandomPlayer());

        const team2 = new Team('TeamName', 0, side, []);

        expect(team2.tryGetRandomPlayer()).toBeNull();
        expect(() => team2.getRandomPlayer()).toThrow(ErrTeamEmpty);
    });

    test('DEVE retornar o goleiro do time', function () {
        const side = Side.HOME;
        const goalkeeper = randomPlayer({ number: SPECS.GOALKEEPER_NUMBER, side });
        const players = [goalkeeper, randomPlayer({ number: 2, side }), randomPlayer({ number: 3, side })];
        const team = new Team('TeamName', 0, side, players);

        expect(team.getGoalkeeper()).toBe(goalkeeper);

        const team2 = new Team('TeamName', 0, side, []);
        expect(() => team2.getGoalkeeper()).toThrow(ErrPlayerNotFound);
        expect(team2.tryGetGoalkeeper()).toBeNull();
    });
});
