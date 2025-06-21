import { BotFactory, IBot, IGymTrainer } from '@/interfaces.js';

import { Client, Environment, GameController, GymSession, Point, SPECS, Side } from '@/core.js';

import { flipSide, isValidPlayerNumber, lerp, randomInitialPosition, sleep } from '@/utils.js';

import { ErrBotInvalidNumber } from '@/errors.js';

import { DummyStatue } from '@/playground.js';

export class Gym {
    private trainingPlayerNumber: number = 10;
    private trainingSide: Side = Side.HOME;
    private myBotsFactory: BotFactory = (number: number, side: Side) => new DummyStatue();
    private opBotsFactory: BotFactory = (number: number, side: Side) => new DummyStatue();
    private environmentFactory: () => Environment = () => new Environment();
    private trainer: IGymTrainer | null = null;
    private serverAddress: string = 'localhost:5000';

    withEnvironment(environment: () => Environment): this {
        this.environmentFactory = environment;
        return this;
    }

    withPlayerNumber(playerNumber: number): this {
        if (isValidPlayerNumber(playerNumber)) {
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

        const trainingInitialPosition: Point | null = null;

        const X1 = SPECS.GOAL_ZONE_RANGE;
        const X2 = SPECS.FIELD_CENTER_X - SPECS.FIELD_CENTER_RADIUS;
        const X3 = SPECS.FIELD_CENTER_X + SPECS.FIELD_CENTER_RADIUS;
        const X4 = SPECS.MAX_X_COORDINATE - SPECS.GOAL_ZONE_RANGE;

        const SIDE_Xs = {
            [Side.HOME]: [X1, X2],
            [Side.AWAY]: [X4, X3],
        };

        const GK_Xs = {
            [Side.HOME]: 0,
            [Side.AWAY]: SPECS.MAX_X_COORDINATE,
        };

        const Y = SPECS.FIELD_CENTER_Y;

        console.log('Criando os bots que irão jogar no time aliado...');

        const mysBots: Record<number, IBot> = {};
        Array.from({ length: SPECS.MAX_PLAYERS }).forEach((_, index) => {
            mysBots[index + 1] = this.myBotsFactory(index + 1, this.trainingSide);
        });

        for (const [number, bot] of Object.entries(mysBots)) {
            const side = this.trainingSide;
            const [X1, X2] = SIDE_Xs[side];
            const X = lerp(X1, X2, (Number(number) - 2) / (SPECS.MAX_PLAYERS - 1));
            const position = Number(number) === SPECS.GOALKEEPER_NUMBER ? new Point(GK_Xs[side], Y) : new Point(X, Y);

            if (this.trainingPlayerNumber === Number(number)) {
                continue;
            }

            const client = new Client(this.serverAddress, '', side, Number(number), position);

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
            const [X3, X4] = SIDE_Xs[side];
            const X = lerp(X3, X4, (Number(number) - 2) / (SPECS.MAX_PLAYERS - 1));
            const position = Number(number) === SPECS.GOALKEEPER_NUMBER ? new Point(GK_Xs[side], Y) : new Point(X, Y);
            const client = new Client(this.serverAddress, '', side, Number(number), position);

            client
                .playAsBot(bot)
                .catch((error) => console.error(`Error starting bot ${number} on side ${side}:`, error));
        }

        await sleep(1000);

        const client = new Client(
            this.serverAddress,
            '',
            this.trainingSide,
            this.trainingPlayerNumber,
            trainingInitialPosition ?? randomInitialPosition(this.trainingSide)
        );

        const session = new GymSession(this.trainer!, controller, client, this.environmentFactory);

        await session.start();
    }
}
