import { Order } from '@/generated/server.js';

import { IClient, IGameController, IGameInspector, IGameSnapshot, IGymSession, IGymTrainer } from '@/interfaces.js';

import { Client } from '@/core/client.js';
import { GameController } from '@/core/controller.js';
import { Environment } from '@/core/environment.js';

import { fromGameSnapshot } from '@/utils/game-inspector.js';
import { sleep } from '@/utils/time.js';

export class GymSession implements IGymSession {
    private trainer: IGymTrainer;
    private remote: IGameController;
    private running: boolean = false;
    private initialEnvironment: Environment | null = null;
    private environmentFactory: () => Environment;
    private lastSnapshot: IGameInspector | null = null;
    private client: IClient;
    private input: unknown = null;
    private output: unknown = null;

    constructor(trainer: IGymTrainer, remote: GameController, client: Client, environmentFactory: () => Environment) {
        this.trainer = trainer;
        this.remote = remote;
        this.client = client;
        this.environmentFactory = environmentFactory;
    }

    // Novo: define e aplica o environment inicial
    async start(): Promise<void> {
        if (this.running) throw new Error('Sessão já está rodando');
        if (!this.trainer) throw new Error('Treinador não definido');
        if (!this.remote) throw new Error('Controlador remoto não definido');
        if (!this.client) throw new Error('Cliente não definido');

        console.log('Iniciando sessão de treinamento...');

        const environment = this.environmentFactory();
        this.initialEnvironment = environment;

        this.client.play(
            async (inspector: IGameInspector): Promise<Order[]> => {
                this.lastSnapshot = inspector;
                this.input = await this.trainer.input(inspector);
                this.output = await this.trainer.predict(this.input, inspector);
                const orders = await this.trainer.play(this.output, inspector);
                return orders.orders;
            },
            async () => {
                await this.applyEnvironment(environment);
                await this.remote.setTurn(1);

                await this.remote.resumeListeningPhase();
                await this.remote.setTurn(1);

                const snapshot = await this.remote.getGameSnapshot();

                if (!snapshot) {
                    throw new Error('Não foi possível capturar a snapshot inicial do jogo');
                }

                const inspector = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), snapshot);

                this.lastSnapshot = inspector;

                this.running = true;
                await this.trainer.train(this);
            }
        );
    }

    // Novo: reaplica o environment original
    async reset(): Promise<IGameSnapshot> {
        const environment = this.environmentFactory();
        if (!environment) throw new Error('Ambiente inicial não definido');
        this.initialEnvironment = environment;
        this.initialEnvironment.setTurn(1);
        const snapshot = await this.applyEnvironment(this.initialEnvironment);
        this.lastSnapshot = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), snapshot);
        return snapshot;
    }

    // Opcional: se quiser permitir `.applyEnvironment(env)`
    async applyEnvironment(env: Environment): Promise<IGameSnapshot> {
        return await this.remote.applyEnvironment(env);
    }

    async update(): Promise<{ input: unknown; output: unknown; reward: number; done: boolean }> {
        if (!this.running) throw new Error('Sessão não está rodando');
        if (!this.lastSnapshot) throw new Error('Snapshot do jogo não disponível');
        if (!this.initialEnvironment) throw new Error('Ambiente inicial não definido');

        await this.remote.setTurn(this.lastSnapshot.getTurn());
        await this.remote.resumeListeningPhase();

        await sleep(15);

        const prevSnapshot = this.lastSnapshot;
        const newSnapshot = await this.remote.getGameSnapshot();

        if (!newSnapshot) {
            throw new Error('Snapshot do jogo não disponível, batata');
        }

        this.lastSnapshot = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), newSnapshot);

        // console.log(`Turn: ${this.lastSnapshot.getTurn()}`);

        if (!this.running) return { input: this.input, output: this.output, done: true, reward: 0 };

        const { reward, done } = await this.trainer.evaluate(prevSnapshot!, this.lastSnapshot!);

        return { input: this.input, output: this.output, reward, done };
    }

    getLastSnapshot(): IGameInspector {
        if (!this.lastSnapshot) throw new Error('Snapshot do jogo não disponível');
        return this.lastSnapshot;
    }

    stop(): void {
        this.running = false;
    }

    getInitialEnvironment(): Environment {
        if (!this.initialEnvironment) throw new Error('Ambiente inicial não definido');
        return this.initialEnvironment;
    }
}
