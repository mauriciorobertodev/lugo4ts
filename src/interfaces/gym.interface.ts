import type { Environment } from "@/core/environment.js";
import type { Side } from "@/core/side.js";
import type { IBot } from "@/interfaces/bot.interface.js";
import type { IGymTrainer } from "@/interfaces/trainer.interface.js";

export type BotFactory = (number: number, side: Side) => IBot;

export interface IGym {
	withPlayerNumber(playerNumber: number): this;
	withTrainingSide(side: Side): this;
	withEnvironment(environment: () => Environment): this;
	withMyBots(factory: BotFactory): this;
	withOpponentBots(factory: BotFactory): this;
	withTrainer(trainer: IGymTrainer): this;
	start(): Promise<void>;
}
