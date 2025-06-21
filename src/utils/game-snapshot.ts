import { IBall, IGameSnapshot, ITeam, ServerState } from '@/interfaces.js';

import { GameSnapshot, ShotClock, Side, Team } from '@/core.js';

import { randomBall, randomTeam } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ---------------------------------------------------------

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function createZeroedSnapshot(): IGameSnapshot {
    return new GameSnapshot(ServerState.WAITING, 0);
}

export function createRandomSnapshot({
    turn = 0,
    homeTeam,
    awayTeam,
    ball,
    turnsBallInGoalZone = 0,
    shotClock,
}: {
    turn?: number;
    homeTeam?: ITeam;
    awayTeam?: Team;
    ball?: IBall;
    turnsBallInGoalZone?: number;
    shotClock?: ShotClock;
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
