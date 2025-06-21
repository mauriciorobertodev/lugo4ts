import { IGameInspector, IGameSnapshot } from '@/interfaces.js';

import { GameInspector, PlayerState, SPECS, Side } from '@/core.js';

import { randomBall, randomInt, randomPlayerState, randomShotClock, randomSide, randomTeam } from '@/utils.js';

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromGameSnapshot(playerSide: Side, playerNumber: number, snapshot: IGameSnapshot): IGameInspector {
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

// ------------------------------------------------------------
// Factories
// ------------------------------------------------------------

export function randomGameInspectorInOnHolding({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): IGameInspector {
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
}): IGameInspector {
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
}): IGameInspector {
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

    const shotClock = randomShotClock();

    return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
}

export function randomGameInspectorInOnSupporting({
    playerSide = randomSide(),
    playerNumber = randomInt(1, SPECS.MAX_PLAYERS),
}: {
    playerSide?: Side;
    playerNumber?: number;
}): IGameInspector {
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
}: { playerSide?: Side; playerState?: PlayerState } = {}): IGameInspector {
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
            throw new Error(`Unknown player state: ${playerState}`);
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
} = {}): IGameInspector {
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
            throw new Error(`Unknown player state: ${playerState}`);
    }
}
