import type { Environment } from "@/core/environment.js";
import type { IGameInspector } from "@/interfaces/game-inspector.js";
import type { IGameSnapshot } from "@/interfaces/game-snapshot.js";

export interface IGymSession {
	start(): Promise<void>;
	stop(): void;
	reset(): Promise<IGameSnapshot>;
	applyEnvironment(env: Environment): Promise<IGameSnapshot>;
	update(): Promise<{ input: unknown; output: unknown; reward: number; done: boolean }>;
	getLastSnapshot(): IGameInspector;
	getInitialEnvironment(): Environment;
}
