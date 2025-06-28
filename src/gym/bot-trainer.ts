import { IGymSession, IGymTrainer } from '@/gym.js';
import { generateOrdersForBot } from '@/runtime.js';

import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';

import { IGameInspector } from '@/core.js';

type State = unknown;
type Action = unknown;

export abstract class BotTrainer implements IGymTrainer<State, Action> {
    async state(game: IGameInspector): Promise<State> {
        return game;
    }

    async action(state: State, game: IGameInspector): Promise<Action> {
        return 0;
    }

    async play(action: Action, inspector: IGameInspector): Promise<Order[]> {
        return generateOrdersForBot(this.getBot(), inspector);
    }

    abstract getBot(): IBot;

    abstract evaluate(prevGame: IGameInspector, currGame: IGameInspector): Promise<{ reward: number; done: boolean }>;

    abstract train(session: IGymSession): Promise<void>;
}
