import { GameClient } from '@/runtime/game-client.js';
import { GameController } from '@/runtime/game-controller.js';

import { Order } from '@/generated/server.js';

import { IGymSession } from '@/interfaces/gym-session.js';
import { IGymTrainer } from '@/interfaces/gym-trainer.js';

import { Environment } from '@/core/environment.js';
import { GameInspector } from '@/core/game-inspector.js';
import { GameSnapshot } from '@/core/game-snapshot.js';

import { fromGameSnapshot } from '@/utils/game-inspector.js';
import { sleep } from '@/utils/time.js';

export class GymSession implements IGymSession {
    private trainer: IGymTrainer;
    private remote: GameController;
    private running: boolean = false;
    private initialEnvironment: Environment | null = null;
    private environmentFactory: () => Environment;
    private lastSnapshot: GameInspector | null = null;
    private client: GameClient;
    private state: unknown = null;
    private action: unknown = null;

    constructor(
        trainer: IGymTrainer,
        remote: GameController,
        client: GameClient,
        environmentFactory: () => Environment
    ) {
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
            async (inspector: GameInspector): Promise<Order[]> => {
                this.lastSnapshot = inspector;
                this.state = await this.trainer.state(inspector);
                this.action = await this.trainer.action(this.state, inspector);
                const orders = await this.trainer.play(this.action, inspector);
                return orders;
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
    async reset(): Promise<GameSnapshot> {
        const environment = this.environmentFactory();
        if (!environment) throw new Error('Ambiente inicial não definido');
        this.initialEnvironment = environment;
        this.initialEnvironment.setTurn(1);
        const snapshot = await this.applyEnvironment(this.initialEnvironment);
        this.lastSnapshot = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), snapshot);
        return snapshot;
    }

    // Opcional: se quiser permitir `.applyEnvironment(env)`
    async applyEnvironment(env: Environment): Promise<GameSnapshot> {
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

        if (!this.running) return { input: this.state, output: this.action, done: true, reward: 0 };

        const { reward, done } = await this.trainer.evaluate(prevSnapshot!, this.lastSnapshot!);

        return { input: this.state, output: this.action, reward, done };
    }

    getLastSnapshot(): GameInspector {
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
