import type { Environment } from "@/core/environment.js";
import type { GameInspector } from "@/core/game-inspector.js";
import type { GameSnapshot } from "@/core/game-snapshot.js";
import type { Order } from "@/generated/server.js";
import type { IGymSession } from "@/interfaces/gym-session.js";
import type { IGymTrainer } from "@/interfaces/gym-trainer.js";
import type { GameClient } from "@/runtime/game-client.js";
import type { GameController } from "@/runtime/game-controller.js";

import { fromGameSnapshot } from "@/utils/game-inspector.js";
import { sleep } from "@/utils/time.js";

export class GymSession implements IGymSession {
	private running: boolean = false;
	private initialEnvironment: Environment | null = null;
	private lastSnapshot: GameInspector | null = null;
	private state: unknown = null;
	private action: unknown = null;

	constructor(
		private trainer: IGymTrainer,
		private remote: GameController,
		private client: GameClient,
		private environmentFactory: () => Environment,
		private turnDuration: number = 50, // Default turn duration in milliseconds
	) {
		// this.remote.on('goal', async (data) => {
		//     await this.applyEnvironment((this.initialEnvironment = this.environmentFactory()));
		// });

		// this.remote.on('state-changed', (data) => {
		//     // console.debug('Estado do servidor alterado:', data.prevState, '->', data.newState);
		//     if (data.newState === ServerState.LISTENING || data.newState === ServerState.READY) {
		//         this.isListening = true;
		//         logger.debug('Fase de escuta iniciada');
		//     } else {
		//         this.isListening = false;
		//         logger.debug('Fase de escuta encerrada');
		//     }
		// });

		// this.remote.on('pause', (data) => {
		//     this.isListening = false;
		//     logger.debug('Jogo pausado');
		// });

		// this.remote.on('play', (data) => {
		//     this.isListening = true;
		//     logger.debug('Jogo retomado');
		// });

		this.remote.setupEventListeners();
	}

	// Novo: define e aplica o environment inicial
	async start(): Promise<void> {
		if (this.running) throw new Error("Sessão já está rodando");
		if (!this.trainer) throw new Error("Treinador não definido");
		if (!this.remote) throw new Error("Controlador remoto não definido");
		if (!this.client) throw new Error("Cliente não definido");

		console.log("Iniciando sessão de treinamento...");

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
					throw new Error("Não foi possível capturar a snapshot inicial do jogo");
				}

				const inspector = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), snapshot);

				this.lastSnapshot = inspector;

				this.running = true;
				await this.trainer.train(this);
			},
		);
	}

	// Novo: reaplica o environment original
	async reset(): Promise<GameSnapshot> {
		const environment = this.environmentFactory();
		if (!environment) throw new Error("Ambiente inicial não definido");

		this.initialEnvironment = environment;
		const snapshot = await this.applyEnvironment(this.initialEnvironment);
		this.lastSnapshot = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), snapshot);
		return snapshot;
	}

	// Opcional: se quiser permitir `.applyEnvironment(env)`
	async applyEnvironment(env: Environment): Promise<GameSnapshot> {
		return await this.remote.applyEnvironment(env);
	}

	async update(): Promise<{ input: unknown; output: unknown; reward: number; done: boolean }> {
		if (!this.running) throw new Error("Sessão não está rodando");
		if (!this.lastSnapshot) throw new Error("Snapshot do jogo não disponível");

		const prevSnapshot = this.lastSnapshot;
		await sleep(this.turnDuration);

		await this.remote.setTurn(this.lastSnapshot.getTurn());
		await this.remote.resumeListeningPhase();

		const newSnapshot = await this.remote.getGameSnapshot();

		if (!newSnapshot) {
			throw new Error("Snapshot do jogo não disponível, batata");
		}

		this.lastSnapshot = fromGameSnapshot(this.client.getSide(), this.client.getNumber(), newSnapshot);

		if (!this.running) return { input: this.state, output: this.action, done: true, reward: 0 };

		const { reward, done } = await this.trainer.evaluate(prevSnapshot, this.lastSnapshot!);

		return { input: this.state, output: this.action, reward, done };
	}

	getLastSnapshot(): GameInspector {
		if (!this.lastSnapshot) throw new Error("Snapshot do jogo não disponível");
		return this.lastSnapshot;
	}

	stop(): void {
		this.running = false;
	}

	getInitialEnvironment(): Environment {
		if (!this.initialEnvironment) throw new Error("Ambiente inicial não definido");
		return this.initialEnvironment;
	}
}
