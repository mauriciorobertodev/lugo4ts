import type { Environment } from "@/core/environment.js";
import type { Side } from "@/core/side.js";
import type { IBall } from "@/interfaces/ball.interface.js";
import type { IFormation } from "@/interfaces/formation.interface.js";
import type { IPlayer } from "@/interfaces/player.interface.js";
import type { IPoint } from "@/interfaces/positionable.interface.js";
import type { IGameSnapshot } from "@/interfaces/snapshot.interface.js";
import type { IVelocity } from "@/interfaces/velocity.interface.js";

export interface IGameController {
	nextTurn(): Promise<IGameSnapshot | null>;
	nextOrder(): Promise<IGameSnapshot | null>;
	play(): Promise<IGameSnapshot | null>;
	pause(): Promise<IGameSnapshot | null>;
	getGameSnapshot(): Promise<IGameSnapshot | null>;
	resumeListeningPhase(): Promise<void>;
	resetPlayerPositions(): Promise<IGameSnapshot>;
	resetBallPosition(): Promise<IGameSnapshot>;

	setTurn(turn: number): Promise<IGameSnapshot>;

	applyEnvironment(environment: Environment): Promise<IGameSnapshot>;

	addPlayer(player: IPlayer): Promise<IGameSnapshot>;
	setPlayerPosition(player: IPlayer, position: IPoint): Promise<IGameSnapshot>;
	setPlayerVelocity(player: IPlayer, velocity: IVelocity): Promise<IGameSnapshot>;
	setPlayerSpeed(player: IPlayer, speed: number): Promise<IGameSnapshot>;

	setBall(ball: IBall): Promise<IGameSnapshot>;
	setBallPosition(position: IPoint): Promise<IGameSnapshot>;
	setBallVelocity(velocity: IVelocity): Promise<IGameSnapshot>;
	setBallSpeed(speed: number): Promise<IGameSnapshot>;

	setTeamFormation(side: Side, formation: IFormation): Promise<void>;
	setHomeTeamFormation(formation: IFormation): Promise<void>;
	setAwayTeamFormation(formation: IFormation): Promise<void>;
}
