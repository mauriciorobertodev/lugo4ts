/** biome-ignore-all lint/complexity/noBannedTypes: <.> */
import type { Side } from "@/core/side.js";
import type { ControllerGameSetup } from "@/interfaces/controller.interface.js";
import type { GameOverReason } from "@/interfaces/game.interface.js";
import type { PlayerObject } from "@/interfaces/player.interface.js";
import type { GameSnapshotObject, ServerState } from "@/interfaces/snapshot.interface.js";

export type CoreEventData = {
	// #region Eventos relacionados ao jogo

	/** Evento disparado quando um gol é marcado */
	"game:goal": {
		/** Lado do time que marcou o gol */
		side: Side;
		/** Snapshot do jogo no momento do gol */
		snapshot?: GameSnapshotObject;
	};

	// #endregion

	// #region Eventos relacionados ao estado do jogo

	/** Evento disparado quando o jogo começa  depois de esperar */
	"game:started": {
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando o jogo está em andamento */
	"game:playing": {
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando o jogo está pausado */
	"game:paused": {
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando o jogo termina */
	"game:over": {
		/** Razão pela qual o jogo terminou */
		reason: GameOverReason;
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando um jogador entra no jogo */
	"game:joined": {
		/** Jogador que entrou no jogo */
		player: PlayerObject;
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando um jogador sai do jogo */
	"game:leaved": {
		/** Jogador que saiu do jogo */
		player: PlayerObject;
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	"game:changed": {
		/** Estado anterior do servidor */
		prevState: ServerState;
		/** Novo estado do servidor */
		newState: ServerState;
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando o jogo termina normalmente, ou seja, quando um time vence o outro, sem ocorrer um nocaute */
	"game:finished": {
		/** Lado que venceu o jogo */
		winner: Side;
		/** Placar do time vencedor */
		winner_score: number;
		/** Lado que perdeu o jogo */
		loser: Side;
		/** Placar do time perdedor */
		loser_score: number;
	};

	/** Evento disparado quando ocorre um nocaute, ou seja, quando um time faz 10x0 */
	"game:knockout": {
		/** Lado que venceu o jogo */
		winner: Side;
		/** Placar do time vencedor */
		winner_score: number;
		/** Lado que perdeu o jogo */
		loser: Side;
		/** Placar do time perdedor */
		loser_score: number;
	};

	/** Evento disparado quando o jogo entra em prorrogação, ou seja, quando o tempo do jogo acaba empatado e o jogo continua até que um time marque um gol ou até que o tempo da prorrogação acabe */
	"game:overtime": {
		/** Duração da prorrogação em turnos */
		duration: number;
	};

	// #endregion

	// #region Eventos relacionados à conexão

	/** Evento disparado quando a conexão é iniciada */
	"connection:started": {
		/** Configurações iniciais do jogo */
		setup: ControllerGameSetup;
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando a conexão é encerrada */
	"connection:ended": null;

	/** Evento disparado quando ocorre um erro na conexão */
	"connection:error": {
		/** Mensagem de erro */
		error: string;
	};

	/** Evento disparado quando a conexão é perdida e a biblioteca está tentando reconectar */
	"connection:retrying": {
		/** Número da tentativa de reconexão (1 para a primeira tentativa, 2 para a segunda, etc.) */
		attempt: number;
		/** Tempo em milissegundos até a próxima tentativa de reconexão */
		next: number;
	};

	/** Evento disparado a cada segundo durante o processo de reconexão, indicando quanto tempo falta para a próxima tentativa */
	"connection:tick": {
		/** Segundos restantes para a próxima tentativa de reconexão */
		left: number;
	};

	// #endregion
};

export type EventMap = object;

type CustomEvents<T extends EventMap> = Omit<T, keyof CoreEventData>;

// Criamos um tipo que permite fundir o Core com o Custom
export type CombinedEvents<T extends EventMap = {}> = CoreEventData & CustomEvents<T>;

export type Event<T extends EventMap = {}> = Extract<keyof CombinedEvents<T>, string>;

export type EventData<T extends EventMap = {}, K extends Event<T> = Event<T>> = K extends keyof CoreEventData
	? CoreEventData[K]
	: K extends keyof CustomEvents<T>
		? CustomEvents<T>[K]
		: never;

export type GenericEventListener<T extends EventMap = {}> = <K extends Event<T>>(event: K, data: EventData<T, K>) => void;
