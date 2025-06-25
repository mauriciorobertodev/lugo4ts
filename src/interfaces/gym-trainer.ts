import type { OrderSet } from '@/generated/server.js';

import type { IGameInspector } from '@/interfaces/game-inspector.js';
import type { IGymSession } from '@/interfaces/gym-session.js';

export interface IGymTrainer<Input = any, Output = any> {
    input: (game: IGameInspector) => Promise<Input>;
    predict: (input: Input, game: IGameInspector) => Promise<Output>;
    play: (output: Output, game: IGameInspector) => Promise<OrderSet>;
    evaluate: (prevGame: IGameInspector, newGame: IGameInspector) => Promise<{ reward: number; done: boolean }>;
    train: (session: IGymSession) => Promise<void>;
}
