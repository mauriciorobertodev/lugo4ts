import { GameInspectorObject } from '@/interfaces/game-inspector.js';
import { GameSnapshotObject } from '@/interfaces/game-snapshot.js';
import { PlayerState } from '@/interfaces/player.js';

import { GameInspector } from '@/core/game-inspector.js';
import { GameSnapshot } from '@/core/game-snapshot.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { fromBallObject, randomBall } from '@/utils/ball.js';
import { randomPlayerState } from '@/utils/player.js';
import { randomInt } from '@/utils/random.js';
import { fromShotClockObject, randomShotClock } from '@/utils/shot-clock.js';
import { randomSide } from '@/utils/side.js';
import { fromTeamObject, randomTeam } from '@/utils/team.js';

import { ErrGameInvalidPlayerState } from '@/errors.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromGameSnapshot(playerSide: Side, playerNumber: number, snapshot: GameSnapshot): GameInspector {
    return new GameInspector(
        playerSide,
        playerNumber,
        snapshot.getHomeTeam(),
        snapshot.getAwayTeam(),
        snapshot.getBall(),
        snapshot.getShotClock() ?? undefined,
        snapshot.getBallTurnsInGoalZone(),
        snapshot.getTurn()
    );
}

export function fromGameInspectorObject(obj: GameInspectorObject): GameInspector {
    return new GameInspector(
        obj.myTeamSide,
        obj.myNumber,
        obj.homeTeam ? fromTeamObject(obj.homeTeam) : undefined,
        obj.awayTeam ? fromTeamObject(obj.awayTeam) : undefined,
        obj.ball ? fromBallObject(obj.ball) : undefined,
        obj.shotClock ? fromShotClockObject(obj.shotClock) : undefined,
        obj.ballTurnsInGoalZone,
        obj.turn
    );
}

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function randomGameInspectorInOnHolding({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): GameInspector {
    const homeTeam = randomTeam({
        side: Side.HOME,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Home Team',
    });

    const awayTeam = randomTeam({
        side: Side.AWAY,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Away Team',
    });

    const me = playerSide === Side.HOME ? homeTeam.getPlayer(playerNumber) : awayTeam.getPlayer(playerNumber);

    const ball = randomBall({ holder: me, position: me.getPosition() });

    const shotClock = randomShotClock();

    return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
}

export function randomGameInspectorInOnDefending({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): GameInspector {
    const homeTeam = randomTeam({
        side: Side.HOME,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Home Team',
    });

    const awayTeam = randomTeam({
        side: Side.AWAY,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Away Team',
    });

    const holderOpponent =
        playerSide === Side.HOME ? awayTeam.getPlayer(playerNumber) : homeTeam.getPlayer(playerNumber);

    const ball = randomBall({ holder: holderOpponent, position: holderOpponent.getPosition() });

    const shotClock = randomShotClock();

    return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
}

export function randomGameInspectorInOnDisputing({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): GameInspector {
    const homeTeam = randomTeam({
        side: Side.HOME,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Home Team',
    });

    const awayTeam = randomTeam({
        side: Side.AWAY,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Away Team',
    });

    const ball = randomBall({ holder: null });

    const shotClock = undefined;

    return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
}

export function randomGameInspectorInOnSupporting({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): GameInspector {
    const homeTeam = randomTeam({
        side: Side.HOME,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Home Team',
    });

    const awayTeam = randomTeam({
        side: Side.AWAY,
        populate: SPECS.MAX_PLAYERS,
        score: 0,
        name: 'Away Team',
    });

    const holderAlly =
        playerSide === Side.HOME ? homeTeam.getRandomPlayer([playerNumber]) : awayTeam.getRandomPlayer([playerNumber]);

    const ball = randomBall({ holder: holderAlly, position: holderAlly.getPosition() });

    const shotClock = randomShotClock();

    return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
}

export function randomGameInspectorInAsGoalKeeper({
    playerState,
    playerSide = randomSide(),
}: { playerSide?: Side; playerState?: PlayerState } = {}): GameInspector {
    switch (playerState) {
        case PlayerState.HOLDING:
            return randomGameInspectorInOnHolding({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
        case PlayerState.DEFENDING:
            return randomGameInspectorInOnDefending({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
        case PlayerState.DISPUTING:
            return randomGameInspectorInOnDisputing({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
        case PlayerState.SUPPORTING:
            return randomGameInspectorInOnSupporting({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
        default:
            throw new ErrGameInvalidPlayerState(String(playerState));
    }
}

export function randomGameInspector({
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
    playerSide = randomSide(),
    playerState = randomPlayerState(),
}: {
    playerNumber?: number;
    playerSide?: Side;
    playerState?: PlayerState;
} = {}): GameInspector {
    const isGoalkeeper = playerNumber === SPECS.GOALKEEPER_NUMBER;

    if (isGoalkeeper) {
        return randomGameInspectorInAsGoalKeeper({ playerState, playerSide });
    }

    switch (playerState) {
        case PlayerState.HOLDING:
            return randomGameInspectorInOnHolding({ playerSide, playerNumber });
        case PlayerState.DEFENDING:
            return randomGameInspectorInOnDefending({ playerSide, playerNumber });
        case PlayerState.DISPUTING:
            return randomGameInspectorInOnDisputing({ playerSide, playerNumber });
        case PlayerState.SUPPORTING:
            return randomGameInspectorInOnSupporting({ playerSide, playerNumber });
        default:
            throw new ErrGameInvalidPlayerState(String(playerState));
    }
}
