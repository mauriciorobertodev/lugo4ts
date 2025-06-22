import { describe, expect, test } from 'vitest';

import { ServerState } from '@/interfaces.js';

import { GameSnapshot, SPECS, Side } from '@/core.js';

import { randomBall, randomShotClock, randomTeam } from '@/utils.js';

describe('Core/GameSnapshot', () => {
    test('Getters e Setters', () => {
        const turn = 0;
        const home = randomTeam({ side: Side.HOME });
        const away = randomTeam({ side: Side.AWAY });
        const holder = home.getRandomPlayer();
        const ball = randomBall({ holder });
        const clock = randomShotClock({ teamSide: Side.HOME });
        const snapshot = new GameSnapshot(ServerState.LISTENING, turn, home, away, ball, 0, clock);

        expect(snapshot.getTurn()).toBe(turn);
        expect(snapshot.getHomeTeam()).toBe(home);
        expect(snapshot.getAwayTeam()).toBe(away);
        expect(snapshot.getBall()).toBe(ball);
        expect(snapshot.getShotClock()).toBe(clock);
        expect(snapshot.getState()).toBe(ServerState.LISTENING);
        expect(snapshot.getHomePlayers()).toEqual(home.getPlayers());
        expect(snapshot.getAwayPlayers()).toEqual(away.getPlayers());
        expect(snapshot.hasBallHolder()).toBe(true);
        expect(snapshot.hasShotClock()).toBe(true);
        expect(snapshot.getHomeGoalkeeper()).toBe(home.getGoalkeeper());
        expect(snapshot.getAwayGoalkeeper()).toBe(away.getGoalkeeper());
        expect(snapshot.getBallPosition()).toEqual(ball.getPosition());
        expect(snapshot.getBallVelocity()).toEqual(ball.getVelocity());
        expect(snapshot.getBallDirection()).toEqual(ball.getDirection());
        expect(snapshot.getBallSpeed()).toBe(ball.getSpeed());
        expect(snapshot.getBallHolder()).toBe(holder);
        expect(snapshot.getBallTurnsInGoalZone()).toBe(0);
        expect(snapshot.getBallRemainingTurnsInGoalZone()).toBe(SPECS.BALL_TIME_IN_GOAL_ZONE);
    });

    test('DEVE retornar se tem o jogador X', () => {
        const turn = 0;
        const home = randomTeam({ side: Side.HOME });
        const away = randomTeam({ side: Side.AWAY });
        const snapshot = new GameSnapshot(ServerState.LISTENING, turn, home, away);

        expect(snapshot.hasHomePlayer(1)).toBe(true);
        expect(snapshot.hasHomePlayer(999)).toBe(false);

        expect(snapshot.hasAwayPlayer(1)).toBe(true);
        expect(snapshot.hasAwayPlayer(999)).toBe(false);
    });
});
