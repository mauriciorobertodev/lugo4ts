import { Environment } from "@/core/environment.js";
import type { Formation } from "@/core/formation.js";
import { Side } from "@/core/side.js";
import { SPECS } from "@/core/specs.js";
import { ErrBotInvalidNumber } from "@/errors.js";
import { GymSession } from "@/gym/session.gym.js";
import type { IBot } from "@/interfaces/bot.interface.js";
import type { IGymTrainer } from "@/interfaces/trainer.interface.js";
import { DummyStatue } from "@/playground/dummies/statue.js";
import { StartInlineFormation } from "@/playground/formations/start-inline.js";
import { GameClient } from "@/runtime/client.runtime.js";
import { GameController } from "@/runtime/controller.runtime.js";
import { logger } from "@/utils/logger.utils.js";
import { isValidPlayerNumber } from "@/utils/player.utils.js";
import { randomInitialPosition } from "@/utils/point.utils.js";
import { flipSide } from "@/utils/side.utils.js";
import { sleep } from "@/utils/time.utils.js";

export class Gym {
	private traineeNumber: number = 10;
	private traineeSide: Side = Side.HOME;
	private serverAddress: string = "localhost:5000";
	private myBotsFactory: (number: number, side: Side) => IBot = (_number: number, _side: Side) => new DummyStatue();
	private opBotsFactory: (number: number, side: Side) => IBot = (_number: number, _side: Side) => new DummyStatue();
	private environmentFactory: () => Environment = () => new Environment();
	private trainerFactory: (() => IGymTrainer) | null = null;
	private myInitialFormationFactory: () => Formation = () => new StartInlineFormation();
	private opInitialFormationFactory: () => Formation = () => new StartInlineFormation();
	private turnDuration: number = 50; // Default turn duration in milliseconds

	withTurnDuration(milliseconds: number): this {
		if (milliseconds <= 0) {
			throw new Error("Turn duration must be a positive number.");
		}
		this.turnDuration = milliseconds;
		return this;
	}

	withMyInitialFormation(factory: () => Formation): this {
		this.myInitialFormationFactory = factory;
		return this;
	}

	withOpponentInitialFormation(factory: () => Formation): this {
		this.opInitialFormationFactory = factory;
		return this;
	}

	withServerAddress(address: string): this {
		this.serverAddress = address;
		return this;
	}

	withEnvironment(environment: () => Environment): this {
		this.environmentFactory = environment;
		return this;
	}

	withTraineeNumber(playerNumber: number): this {
		if (!isValidPlayerNumber(playerNumber)) {
			throw new ErrBotInvalidNumber(String(playerNumber));
		}
		this.traineeNumber = playerNumber;
		return this;
	}

	withTraineeSide(side: Side): this {
		this.traineeSide = side;
		return this;
	}

	withMyBots(factory: (number: number, side: Side) => IBot): this {
		this.myBotsFactory = factory;
		return this;
	}

	withOpponentBots(factory: (number: number, side: Side) => IBot): this {
		this.opBotsFactory = factory;
		return this;
	}

	withTrainer(trainer: () => IGymTrainer): this {
		this.trainerFactory = trainer;
		return this;
	}

	async start(): Promise<void> {
		if (!this.trainerFactory) {
			logger.error("[GYM] Nenhum treinador definido no ginásio. Defina um treinador usando o método `withTrainer()`.");
			return;
		}

		const controller = new GameController(this.serverAddress);

		await controller.getGameSetup();

		logger.debug("[GYM] Criando os bots que irão jogar no time aliado...");

		const mysBots: Record<number, IBot> = {};
		Array.from({ length: SPECS.MAX_PLAYERS }).forEach((_, index) => {
			mysBots[index + 1] = this.myBotsFactory(index + 1, this.traineeSide);
		});

		const myInitialFormation = this.myInitialFormationFactory();
		myInitialFormation.setViewSide(this.traineeSide);

		const opInitialFormation = this.opInitialFormationFactory();
		opInitialFormation.setViewSide(flipSide(this.traineeSide));

		for (const [number, bot] of Object.entries(mysBots)) {
			const side = this.traineeSide;
			const position = myInitialFormation.tryGetPositionOf(Number(number)) ?? randomInitialPosition(side);

			if (this.traineeNumber === Number(number)) {
				continue;
			}

			const client = new GameClient(this.serverAddress, "", side, Number(number), position);

			client.playAsBot(bot).catch((error) => console.error(`Error starting bot ${number} on side ${side}:`, error));
		}

		logger.debug("[GYM] Criando os bots que irão jogar no time oponente...");

		const opBots: Record<number, IBot> = {};
		Array.from({ length: SPECS.MAX_PLAYERS }).forEach((_, index) => {
			opBots[index + 1] = this.opBotsFactory(index + 1, flipSide(this.traineeSide));
		});

		for (const [number, bot] of Object.entries(opBots)) {
			const side = flipSide(this.traineeSide);
			const position = opInitialFormation.tryGetPositionOf(Number(number)) ?? randomInitialPosition(side);

			const client = new GameClient(this.serverAddress, "", side, Number(number), position);

			client.playAsBot(bot).catch((error) => console.error(`Error starting bot ${number} on side ${side}:`, error));
		}

		await sleep(1000);

		const client = new GameClient(
			this.serverAddress,
			"",
			this.traineeSide,
			this.traineeNumber,
			myInitialFormation.tryGetPositionOf(this.traineeNumber) ?? randomInitialPosition(this.traineeSide),
		);

		const trainer = this.trainerFactory();

		const session = new GymSession(trainer, controller, client, this.environmentFactory, this.turnDuration);

		await session.start();
	}
}
