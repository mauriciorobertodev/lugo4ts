import { GymSession, IGymTrainer } from '@/gym.js';
import { generateOrdersForBot } from '@/runtime.js';

import { Order } from '@/generated/server.js';

import { IBot } from '@/interfaces/bot.js';

import { GameInspector } from '@/core/game-inspector.js';

type State = unknown;
type Action = unknown;

export abstract class BotTrainer implements IGymTrainer<State, Action> {
    async state(game: GameInspector): Promise<State> {
        return game;
    }

    async action(state: State, game: GameInspector): Promise<Action> {
        return 0;
    }

    async play(action: Action, inspector: GameInspector): Promise<Order[]> {
        return generateOrdersForBot(this.getBot(), inspector);
    }

    abstract getBot(): IBot;

    abstract evaluate(prevGame: GameInspector, currGame: GameInspector): Promise<{ reward: number; done: boolean }>;

    abstract train(session: GymSession): Promise<void>;
}
