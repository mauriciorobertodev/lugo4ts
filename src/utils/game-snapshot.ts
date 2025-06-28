// ------------------------------------------------------------
// Converters
// ---------------------------------------------------------
import { ServerState } from '@/interfaces/game-snapshot.js';

import { Ball } from '@/core/ball.js';
import { GameSnapshot } from '@/core/game-snapshot.js';
import { ShotClock } from '@/core/shot-clock.js';
import { Side } from '@/core/side.js';
import { Team } from '@/core/team.js';

import { randomBall } from '@/utils/ball.js';
import { randomTeam } from '@/utils/team.js';

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function createZeroedSnapshot(): GameSnapshot {
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
    homeTeam?: Team | null;
    awayTeam?: Team | null;
    ball?: Ball | null;
    turnsBallInGoalZone?: number;
    shotClock?: ShotClock;
} = {}): GameSnapshot {
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
