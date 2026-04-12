import type { Side } from "@/core/side.js";
import type { GameSetup } from "@/generated/broadcast.js";
import type { GameOverReason } from "@/interfaces/game.interface.js";
import type { PlayerNumber, PlayerObject } from "@/interfaces/player.interface.js";
import type { GameSnapshotObject, ServerState } from "@/interfaces/snapshot.interface.js";
import type { GoalObject } from "./goal.interface.js";

export type EventData = {
	// #region Eventos relacionados ao jogo

	/** Evento disparado quando um gol é marcado */
	"game:goal": {
		/** Lado que marcou o gol */
		side: Side;
		/** Jogador que marcou o gol */
		player: PlayerNumber;
		/** Placar do time que marcou o gol */
		scoring_team_score: number;
		/** Placar do time adversário */
		opponent_team_score: number;
		/** Snapshot do jogo no momento do gol */
		snapshot?: GameSnapshotObject;
	};

	/** Evento disparado quando um chute é feito */
	"game:shot": {
		/** Lado que fez o chute */
		side: Side;
		/** Jogador que fez o chute */
		player: PlayerNumber;
		/** Intensidade do chute comparado a velocidade máxima da bola (0-1) */
		intensity: number;
	};

	/** Evento disparado quando o goleiro faz uma defesa */
	"game:defense": {
		/** Lado que fez a defesa */
		side: Side;
		/** Jogador que fez a defesa */
		player: PlayerNumber;
		/** Intensidade da defesa comparando a velocidade que foi pega com a velocidade máxima da bola (0-1) */
		intensity: number;
	};

	/** Evento disparado quando o goleiro pega a bola que estava parada */
	"game:catch": {
		/** Lado que pegou a bola */
		side: Side;
		/** Jogador que pegou a bola */
		player: PlayerNumber;
	};

	/** Evento disparado quando a posse de bola muda do time A para o time B, ou seja roubo de bola, sem que a bola tenha sido chutada ou seja no corpo a corpo */
	"game:steal": {
		thief: {
			/** Lado que roubou a posse de bola */
			side: Side;
			/** Jogador que roubou a posse de bola */
			player: PlayerNumber;
		};
		victim: {
			/** Lado que perdeu a posse de bola */
			side: Side;
			/** Jogador que perdeu a posse de bola */
			player: PlayerNumber;
		};
	};

	/** Evento disparado quando um passe é feito, ou seja o último holder e o novo holder são do mesmo time sem a bola ter parado */
	// TODO: no futuro talvez seria interessante, a gente detectar se existe um aliado na trajetória do chute, e se tiver chamar de game:pass/shoot e depois quando receber game:pass/receive
	// Assim a gente pode até calcular passes que não foram efetivados, ou seja, quando o jogador tentou passar para um aliado mas a bola foi interceptada por um adversário, ou quando o jogador tentou passar para um aliado mas errou o passe e a bola parou no meio do caminho, ou seja, sem chegar no aliado.
	"game:pass": {
		kicker: {
			/** Lado que fez o passe */
			side: Side;
			/** Jogador que fez o passe */
			player: PlayerNumber;
		};
		receiver: {
			/** Lado que recebeu o passe */
			side: Side;
			/** Jogador que recebeu o passe */
			player: PlayerNumber;
		};
	};

	/** Evento disparado quando uma interceptação é feita, ou seja o último holder e o novo holder são de times diferentes sem a bola ter parado, e sem que a bola tenha um holder */
	"game:interception": {
		interceptor: {
			/** Lado que fez a interceptação */
			side: Side;
			/** Jogador que fez a interceptação */
			player: PlayerNumber;
		};
		intercepted: {
			/** Lado que teve a posse de bola interceptada */
			side: Side;
			/** Jogador que teve a posse de bola interceptada */
			player: PlayerNumber;
		};
	};

	/** Evento disparado quando a bola toca nas laterais do campo (paredes) e inverte o ângulo de movimento */
	"game:ball/wall": {
		/** Lado que tocou na parede */
		side: "left" | "right" | "top" | "bottom";
		/** Intensidade do impacto na parede */
		intensity: number;
	};

	/** Evento disparado quando a bola toca na trave do gol e inverte o ângulo de movimento */
	"game:ball/goalpost": {
		/** Lado que tocou no gol */
		goal: GoalObject;
		/** Trave que tocou no gol */
		pole: "top" | "bottom";
		/** Intensidade do impacto no gol */
		intensity: number;
	};

	/** Evento disparado quando a bola que estava em movimento para completamente, ou seja, sua velocidade chega a zero */
	"game:ball/stopped": null;

	/** Evento disparado quando a bola que estava com um holder para completamente, ou seja, sua velocidade chega a zero, ou seja o jogador só soltou ela nem chutou */
	"game:ball/dropped": {
		/** Lado que deixou a bola cair */
		side: Side;
		/** Jogador que deixou a bola cair */
		player: PlayerNumber;
	};

	/** Evento disparado quando o goleiro salta para tentar defender um chute */
	"game:goalkeeper/flying": {
		/** Lado que fez o salto */
		side: Side;
		/** Jogador que fez o salto */
		player: PlayerNumber;
		/** Duração do salto em turnos */
		duration: number;
		/** Turnos restantes para o goleiro aterrissar no chão */
		remaining: number;
		/** Intensidade do salto comparado a velocidade máxima do goleiro */
		intensity: number;
	};

	/** Evento disparado quando o goleiro aterrissa no chão após um salto */
	"game:goalkeeper/land": {
		/** Lado que fez o salto */
		side: Side;
		/** Jogador que fez o salto */
		player: PlayerNumber;
		/** Duração do salto em turnos */
		duration: number;
		/** Intensidade do salto comparado a velocidade máxima do goleiro */
		intensity: number;
	};

	/** Evento disparado com base na distância da bola em relação ao gol para aumentar ou diminuir o som de fundo da torcida */
	"game:intensity": {
		/** Intensidade do barulho comparado ao barulho máximo da torcida */
		intensity: number;
	};

	/** Evento para contagem regressiva quando de tempo de posse ou fim de partida */
	"game:countdown": {
		/** Quantos turnos faltam */
		remaining: number;
		/** Se é o tempo de posse (shot clock) ou o tempo da partida (game) */
		type: "possession" | "game";
	};

	// #endregion

	// #region Eventos relacionados ao estado do jogo

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
		setup: GameSetup;
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

export type Event = keyof EventData;

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
