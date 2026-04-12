import type { Side } from "@/core/side.js";
import type { GameSetup } from "@/generated/broadcast.js";
import type { GameOverReason } from "@/interfaces/game.interface.js";
import type { PlayerObject } from "@/interfaces/player.interface.js";
import type { GameSnapshotObject, ServerState } from "@/interfaces/snapshot.interface.js";

export type EventData = {
	/** Evento disparado quando um gol é marcado */
	"game:goal": {
		/** Lado que marcou o gol */
		side: Side;
		/** Snapshot do jogo no momento do gol */
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
		/** Snapshot do jogo no momento do evento */
		snapshot?: GameSnapshotObject;
		/** Razão pela qual o jogo terminou */
		reason: GameOverReason;
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

	/** Evento disparado quando a conexão é iniciada */
	"connection:started": {
		setup: GameSetup;
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
};

export type Event = keyof EventData;

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
