import { describe, expect, test } from 'vitest';

import { ServerState } from '@/interfaces.js';

import { GameSnapshot, Side } from '@/core.js';

import { randomBall, randomShotClock, randomTeam, zeroedBall } from '@/utils.js';

describe('Core/GameSnapshot', () => {
    test('Getters e Setters', () => {
        const turn = 0;
        const home = randomTeam({ side: Side.HOME });
        const away = randomTeam({ side: Side.AWAY });
        const holder = home.getRandomPlayer();
        const ball = randomBall({ holder });
        const clock = randomShotClock({ teamSide: Side.HOME });
        const snapshot = new GameSnapshot(ServerState.LISTENING, turn, home, away, ball);

        expect(snapshot.getTurn()).toBe(turn);
        expect(snapshot.getHomeTeam()).toBe(home);
        expect(snapshot.getAwayTeam()).toBe(away);
        expect(snapshot.getBall()).toBe(ball);
        expect(snapshot.getShotClock()).toBe(clock);
    });
});
