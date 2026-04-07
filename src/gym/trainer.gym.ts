import type { GameInspector } from "@/core/game-inspector.js";
import type { Order } from "@/generated/server.js";
import type { GymSession, IGymTrainer } from "@/gym.js";

import type { IBot } from "@/interfaces/bot.js";
import { generateOrdersForBot } from "@/runtime.js";

type State = unknown;
type Action = unknown;

export abstract class BotTrainer implements IGymTrainer<State, Action> {
	async state(game: GameInspector): Promise<State> {
		return game;
	}

	async action(_state: State, _game: GameInspector): Promise<Action> {
		return 0;
	}

	async play(_action: Action, inspector: GameInspector): Promise<Order[]> {
		return generateOrdersForBot(this.getBot(), inspector);
	}

	abstract getBot(): IBot;

	abstract evaluate(prevGame: GameInspector, currGame: GameInspector): Promise<{ reward: number; done: boolean }>;

	abstract train(session: GymSession): Promise<void>;
}
