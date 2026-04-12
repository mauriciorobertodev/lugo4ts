import type { Environment } from "@/core/environment.js";
import type { Side } from "@/core/side.js";
import type { IBall } from "@/interfaces/ball.interface.js";
import type { IFormation } from "@/interfaces/formation.interface.js";
import type { GameState } from "@/interfaces/game.interface.js";
import type { IPlayer } from "@/interfaces/player.interface.js";
import type { IPoint } from "@/interfaces/positionable.interface.js";
import type { IGameSnapshot } from "@/interfaces/snapshot.interface.js";
import type { IVelocity } from "@/interfaces/velocity.interface.js";

export type RetryConfig = {
	/** Se deve tentar reconectar automaticamente (padrão: true) */
	auto?: boolean;
	/** Número máximo de tentativas de reconexão (padrão: infinito) */
	attempts?: number;
	/** Delay entre tentativas de reconexão em milissegundos */
	delay?: number;
};

export interface IGameController {
	connect(config?: RetryConfig): Promise<void>;

	getState(): GameState;
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
	setPlayerPosition(side: Side, number: number, position: IPoint): Promise<IGameSnapshot>;
	setPlayersPositions(positions: { side: Side; number: number; position: IPoint }[]): Promise<IGameSnapshot>;
	setPlayerVelocity(side: Side, number: number, velocity: IVelocity): Promise<IGameSnapshot>;
	setPlayerSpeed(side: Side, number: number, speed: number): Promise<IGameSnapshot>;

	setBall(ball: IBall): Promise<IGameSnapshot>;
	setBallPosition(position: IPoint): Promise<IGameSnapshot>;
	setBallVelocity(velocity: IVelocity): Promise<IGameSnapshot>;
	setBallSpeed(speed: number): Promise<IGameSnapshot>;

	setTeamFormation(side: Side, formation: IFormation): Promise<IGameSnapshot>;
	setHomeTeamFormation(formation: IFormation): Promise<IGameSnapshot>;
	setAwayTeamFormation(formation: IFormation): Promise<IGameSnapshot>;
}
