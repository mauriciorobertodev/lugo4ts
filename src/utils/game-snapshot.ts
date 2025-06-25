// ------------------------------------------------------------
// Converters
// ---------------------------------------------------------
import { IBall } from '@/interfaces/ball.js';
import { IGameSnapshot, ServerState } from '@/interfaces/game-snapshot.js';
import { IShotClock } from '@/interfaces/shot-clock.js';
import { ITeam } from '@/interfaces/team.js';

import { GameSnapshot } from '@/core/game-snapshot.js';
import { Side } from '@/core/side.js';

import { randomBall } from '@/utils/ball.js';
import { randomTeam } from '@/utils/team.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function createZeroedSnapshot(): IGameSnapshot {
    return new GameSnapshot(ServerState.WAITING, 0);
}

export function randomGameSnapshot({
    turn = 0,
    homeTeam,
    awayTeam,
    ball,
    turnsBallInGoalZone = 0,
    shotClock,
}: {
    turn?: number;
    homeTeam?: ITeam | null;
    awayTeam?: ITeam | null;
    ball?: IBall | null;
    turnsBallInGoalZone?: number;
    shotClock?: IShotClock;
} = {}): IGameSnapshot {
    return new GameSnapshot(
        ServerState.WAITING,
        turn,
        homeTeam ?? randomTeam({ side: Side.HOME, populate: 11, score: 0, name: 'Home Team' }),
        awayTeam ?? randomTeam({ side: Side.AWAY, populate: 11, score: 0, name: 'Away Team' }),
        ball ?? randomBall(),
        turnsBallInGoalZone,
        shotClock
    );
}
