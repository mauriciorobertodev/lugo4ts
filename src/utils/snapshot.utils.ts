import type { Ball } from "@/core/ball.js";
import { GameSnapshot } from "@/core/game-snapshot.js";
import type { ShotClock } from "@/core/shot-clock.js";
import { Side } from "@/core/side.js";
import type { Team } from "@/core/team.js";
import { type GameSnapshotObject, ServerState } from "@/interfaces/snapshot.interface.js";

import { fromBallObject, randomBall } from "@/utils/ball.utils.js";
import { fromTeamObject, randomTeam } from "@/utils/team.utils.js";

import { fromShotClockObject } from "./shot-clock.utils.js";

// ------------------------------------------------------------
// Converters
// ------------------------------------------------------------

export function fromGameSnapshotObject(obj: GameSnapshotObject): GameSnapshot {
	return new GameSnapshot(
		obj.state,
		obj.turn,
		obj.homeTeam ? fromTeamObject(obj.homeTeam) : undefined,
		obj.awayTeam ? fromTeamObject(obj.awayTeam) : undefined,
		obj.ball ? fromBallObject(obj.ball) : undefined,
		obj.ballTurnsInGoalZone,
		obj.shotClock ? fromShotClockObject(obj.shotClock) : undefined,
	);
}

export function fromGameSnapshotJsonString(json: string): GameSnapshot {
	const obj = JSON.parse(json) as GameSnapshotObject;
	return fromGameSnapshotObject(obj);
}

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
		homeTeam ?? randomTeam({ side: Side.HOME, populate: 11, score: 0, name: "Home Team" }),
		awayTeam ?? randomTeam({ side: Side.AWAY, populate: 11, score: 0, name: "Away Team" }),
		ball ?? randomBall(),
		turnsBallInGoalZone,
		shotClock,
	);
}
