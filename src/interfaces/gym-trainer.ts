import type { Order } from '@/generated/server.js';

import type { IGameInspector } from '@/interfaces/game-inspector.js';
import type { IGymSession } from '@/interfaces/gym-session.js';

export interface IGymTrainer<State = any, Action = any> {
    state(game: IGameInspector): Promise<State>;
    action(state: State, game: IGameInspector): Promise<Action>;
    play(action: Action, game: IGameInspector): Promise<Order[]>;
    evaluate(prevGame: IGameInspector, currGame: IGameInspector): Promise<{ reward: number; done: boolean }>;
    train(session: IGymSession): Promise<void>;
}
