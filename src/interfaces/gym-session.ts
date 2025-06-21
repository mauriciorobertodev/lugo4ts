import { IGameInspector, IGameSnapshot } from '@/interfaces.js';

import { Environment } from '@/core.js';

export interface IGymSession {
    start(): Promise<void>;
    stop(): void;
    reset(): Promise<IGameSnapshot>;
    applyEnvironment(env: Environment): Promise<IGameSnapshot>;
    update(): Promise<{ input: unknown; output: unknown; reward: number; done: boolean }>;
    getLastSnapshot(): IGameInspector;
    getInitialEnvironment(): Environment;
}
