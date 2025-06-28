import { GymSession } from '@/gym/session.js';
import { GameClient } from '@/runtime/game-client.js';
import { GameController } from '@/runtime/game-controller.js';

import { IBot } from '@/interfaces/bot.js';
import { IGymTrainer } from '@/interfaces/gym-trainer.js';
import { BotFactory } from '@/interfaces/gym.js';

import { Environment } from '@/core/environment.js';
import { Formation } from '@/core/formation.js';
import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { isValidPlayerNumber } from '@/utils/player.js';
import { randomInitialPosition } from '@/utils/point.js';
import { flipSide } from '@/utils/side.js';
import { sleep } from '@/utils/time.js';

import { ErrBotInvalidNumber } from '@/errors.js';

import { DummyStatue } from '@/playground/dummies/statue.js';
import { StartInlineFormation } from '@/playground/formations/start-inline.js';

export class Gym {
    private trainingPlayerNumber: number = 10;
    private trainingSide: Side = Side.HOME;
    private myBotsFactory: BotFactory = (number: number, side: Side) => new DummyStatue();
    private opBotsFactory: BotFactory = (number: number, side: Side) => new DummyStatue();
    private environmentFactory: () => Environment = () => new Environment();
    private trainer: IGymTrainer | null = null;
    private serverAddress: string = 'localhost:5000';
    private myInitialFormation: Formation = new StartInlineFormation(this.trainingSide);
    private opInitialFormation: Formation = new StartInlineFormation(flipSide(this.trainingSide));

    withServerAddress(address: string): this {
        this.serverAddress = address;
        return this;
    }

    withEnvironment(environment: () => Environment): this {
        this.environmentFactory = environment;
        return this;
    }

    withPlayerNumber(playerNumber: number): this {
        if (!isValidPlayerNumber(playerNumber)) {
            throw new ErrBotInvalidNumber(String(playerNumber));
        }
        this.trainingPlayerNumber = playerNumber;
        return this;
    }

    withTrainingSide(side: Side): this {
        this.trainingSide = side;
        return this;
    }

    withMyBots(factory: BotFactory): this {
        this.myBotsFactory = factory;
        return this;
    }

    withOpponentBots(factory: BotFactory): this {
        this.opBotsFactory = factory;
        return this;
    }

    withTrainer(trainer: IGymTrainer): this {
        this.trainer = trainer;
        return this;
    }

    async start(): Promise<void> {
        const controller = new GameController(this.serverAddress);

        await controller.getGameSetup();

        console.log('Criando os bots que irão jogar no time aliado...');

        const mysBots: Record<number, IBot> = {};
        Array.from({ length: SPECS.MAX_PLAYERS }).forEach((_, index) => {
            mysBots[index + 1] = this.myBotsFactory(index + 1, this.trainingSide);
        });

        for (const [number, bot] of Object.entries(mysBots)) {
            const side = this.trainingSide;
            const position = this.myInitialFormation.tryGetPositionOf(Number(number)) ?? randomInitialPosition(side);

            if (this.trainingPlayerNumber === Number(number)) {
                continue;
            }

            const client = new GameClient(this.serverAddress, '', side, Number(number), position);

            client
                .playAsBot(bot)
                .catch((error) => console.error(`Error starting bot ${number} on side ${side}:`, error));
        }

        console.log('Criando os bots que irão jogar no time oponente...');

        const opBots: Record<number, IBot> = {};
        Array.from({ length: SPECS.MAX_PLAYERS }).forEach((_, index) => {
            opBots[index + 1] = this.opBotsFactory(index + 1, flipSide(this.trainingSide));
        });

        for (const [number, bot] of Object.entries(opBots)) {
            const side = flipSide(this.trainingSide);
            const position = this.opInitialFormation.tryGetPositionOf(Number(number)) ?? randomInitialPosition(side);

            const client = new GameClient(this.serverAddress, '', side, Number(number), position);

            client
                .playAsBot(bot)
                .catch((error) => console.error(`Error starting bot ${number} on side ${side}:`, error));
        }

        await sleep(1000);

        const client = new GameClient(
            this.serverAddress,
            '',
            this.trainingSide,
            this.trainingPlayerNumber,
            this.myInitialFormation.tryGetPositionOf(this.trainingPlayerNumber) ??
                randomInitialPosition(this.trainingSide)
        );

        const session = new GymSession(this.trainer!, controller, client, this.environmentFactory);

        await session.start();
    }
}
