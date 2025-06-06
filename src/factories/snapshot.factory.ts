import { GameSnapshot, GameSnapshot_State } from '../generated/server.js';

import { ServerState } from '../interfaces/snapshot.js';

import { Snapshot } from '../core/snapshot.js';
import { BallFactory } from './ball.factory.js';
import { ClockFactory } from './clock.factory.js';
import { TeamFactory } from './team.factory.js';

export class SnapshotFactory {
    static fromLugoSnapshot(snapshot: GameSnapshot): Snapshot {
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
}
