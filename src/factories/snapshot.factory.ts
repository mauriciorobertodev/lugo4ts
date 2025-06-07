import { GameSnapshot_State, GameSnapshot as LugoGameSnapshot, Player } from '../generated/server.js';

import { ServerState } from '../interfaces/snapshot.js';

import { Ball } from '../core/ball.js';
import { ShotClock } from '../core/clock.js';
import { GameInspector } from '../core/inspector.js';
import { PlayerState } from '../core/player.js';
import { Side, SideFactory } from '../core/side.js';
import { Snapshot } from '../core/snapshot.js';
import { SPECS } from '../core/specs.js';
import { Team } from '../core/team.js';
import { Util } from '../core/util.js';
import { BallFactory } from './ball.factory.js';
import { ClockFactory } from './clock.factory.js';
import { PlayerFactory, PlayerStateFactory } from './player.factory.js';
import { TeamFactory } from './team.factory.js';

export class SnapshotFactory {
    static fromLugoSnapshot(snapshot: LugoGameSnapshot): Snapshot {
        return new Snapshot(
            SnapshotFactory.serverStateFromLugoGameState(snapshot.state),
            snapshot.turn,
            snapshot.homeTeam ? TeamFactory.fromLugoTeam(snapshot.homeTeam) : undefined,
            snapshot.awayTeam ? TeamFactory.fromLugoTeam(snapshot.awayTeam) : undefined,
            snapshot.ball ? BallFactory.fromLugoBall(snapshot.ball) : undefined,
            snapshot.turnsBallInGoalZone,
            snapshot.shotClock ? ClockFactory.fromLugoShotClock(snapshot.shotClock) : undefined
        );
    }

    static serverStateFromLugoGameState(state: GameSnapshot_State): ServerState {
        switch (state) {
            case GameSnapshot_State.WAITING:
                return ServerState.WAITING;
            case GameSnapshot_State.GET_READY:
                return ServerState.READY;
            case GameSnapshot_State.LISTENING:
                return ServerState.LISTENING;
            case GameSnapshot_State.PLAYING:
                return ServerState.PLAYING;
            case GameSnapshot_State.SHIFTING:
                return ServerState.SHIFTING;
            case GameSnapshot_State.OVER:
                return ServerState.OVER;
            default:
                throw new Error(`Unknown game state: ${state}`);
        }
    }

    static random({
        turn = 0,
        homeTeam,
        awayTeam,
        ball,
        turnsBallInGoalZone = 0,
        shotClock,
    }: {
        turn?: number;
        homeTeam?: Team;
        awayTeam?: Team;
        ball?: Ball;
        turnsBallInGoalZone?: number;
        shotClock?: ShotClock;
    } = {}): Snapshot {
        return new Snapshot(
            ServerState.WAITING,
            turn,
            homeTeam ?? TeamFactory.random({ side: Side.HOME, playersCount: 11, score: 0, name: 'Home Team' }),
            awayTeam ?? TeamFactory.random({ side: Side.AWAY, playersCount: 11, score: 0, name: 'Away Team' }),
            ball ?? BallFactory.random(),
            turnsBallInGoalZone,
            shotClock
        );
    }
}

export class InspectorFactory {
    static fromLugoGameSnapshot(playerSide: Side, playerNumber: number, snapshot: LugoGameSnapshot): GameInspector {
        return new GameInspector(
            playerSide,
            playerNumber,
            snapshot.homeTeam ? TeamFactory.fromLugoTeam(snapshot.homeTeam) : undefined,
            snapshot.awayTeam ? TeamFactory.fromLugoTeam(snapshot.awayTeam) : undefined,
            snapshot.ball ? BallFactory.fromLugoBall(snapshot.ball) : undefined,
            snapshot.shotClock ? ClockFactory.fromLugoShotClock(snapshot.shotClock) : undefined,
            snapshot.turnsBallInGoalZone ?? 0
        );
    }

    /**
     * O jogador atual está com a posse de bola.
     * O jogador atual não é o goleiro.
     */
    static randomOnHolding({
        playerSide = SideFactory.random(),
        playerNumber = Util.randomInt(1, SPECS.MAX_PLAYERS),
    }: {
        playerSide?: Side;
        playerNumber?: number;
    }): GameInspector {
        const homeTeam = TeamFactory.random({
            side: Side.HOME,
            playersCount: 11,
            score: 0,
            name: 'Home Team',
        });

        const awayTeam = TeamFactory.random({
            side: Side.AWAY,
            playersCount: 11,
            score: 0,
            name: 'Away Team',
        });

        const me = playerSide === Side.HOME ? homeTeam.getPlayer(playerNumber) : awayTeam.getPlayer(playerNumber);

        const ball = BallFactory.random({ holder: me, position: me.getPosition() });

        const shotClock = ClockFactory.random();

        return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
    }

    /**
     * Um jogador do time adversário está com a posse de bola.
     * O jogador atual está defendendo.
     * O jogador atual não é o goleiro.
     */
    static randomOnDefending({
        playerSide = SideFactory.random(),
        playerNumber = Util.randomInt(1, SPECS.MAX_PLAYERS),
    }: {
        playerSide?: Side;
        playerNumber?: number;
    }): GameInspector {
        const homeTeam = TeamFactory.random({
            side: Side.HOME,
            playersCount: 11,
            score: 0,
            name: 'Home Team',
        });

        const awayTeam = TeamFactory.random({
            side: Side.AWAY,
            playersCount: 11,
            score: 0,
            name: 'Away Team',
        });

        const holderOpponent =
            playerSide === Side.HOME ? awayTeam.getPlayer(playerNumber) : homeTeam.getPlayer(playerNumber);

        const ball = BallFactory.random({ holder: holderOpponent, position: holderOpponent.getPosition() });

        const shotClock = ClockFactory.random();

        return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
    }

    /**
     * Nenhum jogador está com a posse de bola.
     * O jogador atual está disputando a posse de bola.
     * O jogador atual não é o goleiro.
     */
    static randomOnDisputing({
        playerSide = SideFactory.random(),
        playerNumber = Util.randomInt(1, SPECS.MAX_PLAYERS),
    }: {
        playerSide?: Side;
        playerNumber?: number;
    }): GameInspector {
        const homeTeam = TeamFactory.random({
            side: Side.HOME,
            playersCount: 11,
            score: 0,
            name: 'Home Team',
        });

        const awayTeam = TeamFactory.random({
            side: Side.AWAY,
            playersCount: 11,
            score: 0,
            name: 'Away Team',
        });

        const ball = BallFactory.random({ holder: null });

        const shotClock = ClockFactory.random();

        return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
    }

    /**
     * O jogador atual está apoiando um jogador do time adversário.
     * O jogador atual não é o goleiro.
     * O jogador atual não está com a posse de bola.
     */
    static randomOnSupporting({
        playerSide = SideFactory.random(),
        playerNumber = Util.randomInt(1, SPECS.MAX_PLAYERS),
    }: {
        playerSide?: Side;
        playerNumber?: number;
    }): GameInspector {
        const homeTeam = TeamFactory.random({
            side: Side.HOME,
            playersCount: 11,
            score: 0,
            name: 'Home Team',
        });

        const awayTeam = TeamFactory.random({
            side: Side.AWAY,
            playersCount: 11,
            score: 0,
            name: 'Away Team',
        });

        const holderAlly = playerSide === Side.HOME ? homeTeam.getRandomPlayer() : awayTeam.getRandomPlayer();

        const ball = BallFactory.random({ holder: null, position: holderAlly.getPosition() });

        const shotClock = ClockFactory.random();

        return new GameInspector(playerSide, playerNumber, homeTeam, awayTeam, ball, shotClock, 0);
    }

    /**
     * Cria um GameInspector com o jogador atual como goleiro.
     */
    static asGoalKeeper({
        playerState,
        playerSide = SideFactory.random(),
    }: { playerSide?: Side; playerState?: PlayerState } = {}): GameInspector {
        switch (playerState) {
            case PlayerState.HOLDING:
                return InspectorFactory.randomOnHolding({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
            case PlayerState.DEFENDING:
                return InspectorFactory.randomOnDefending({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
            case PlayerState.DISPUTING:
                return InspectorFactory.randomOnDisputing({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
            case PlayerState.SUPPORTING:
                return InspectorFactory.randomOnSupporting({ playerNumber: SPECS.GOALKEEPER_NUMBER, playerSide });
            default:
                throw new Error(`Unknown player state: ${playerState}`);
        }
    }

    static random({
        playerNumber = Util.randomInt(1, SPECS.MAX_PLAYERS),
        playerSide = SideFactory.random(),
        playerState = PlayerStateFactory.random(),
    }: {
        playerNumber?: number;
        playerSide?: Side;
        playerState?: PlayerState;
    } = {}): GameInspector {
        const isGoalkeeper = playerNumber === SPECS.GOALKEEPER_NUMBER;

        if (isGoalkeeper) {
            return InspectorFactory.asGoalKeeper({ playerState, playerSide });
        }

        switch (playerState) {
            case PlayerState.HOLDING:
                return InspectorFactory.randomOnHolding({ playerSide, playerNumber });
            case PlayerState.DEFENDING:
                return InspectorFactory.randomOnDefending({ playerSide, playerNumber });
            case PlayerState.DISPUTING:
                return InspectorFactory.randomOnDisputing({ playerSide, playerNumber });
            case PlayerState.SUPPORTING:
                return InspectorFactory.randomOnSupporting({ playerSide, playerNumber });
            default:
                throw new Error(`Unknown player state: ${playerState}`);
        }
    }
}
