import type { Environment } from "@/core/environment.js";
import type { IGameInspector } from "@/interfaces/inspector.interface.js";
import type { IGameSnapshot } from "@/interfaces/snapshot.interface.js";

export interface IGymSession {
	start(): Promise<void>;
	stop(): void;
	reset(): Promise<IGameSnapshot>;
	applyEnvironment(env: Environment): Promise<IGameSnapshot>;
	update(): Promise<{ input: unknown; output: unknown; reward: number; done: boolean }>;
	getLastSnapshot(): IGameInspector;
	getInitialEnvironment(): Environment;
}
