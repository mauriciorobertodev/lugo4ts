import type { GoalObject } from "@/interfaces/goal.interface.js";
import type { PlayerObject } from "@/interfaces/player.interface.js";

export interface BasicEventData {
	// #region Eventos relacionados ao jogo

	/** Evento disparado quando um chute é feito */
	"game:kick": {
		/** Jogador que fez o chute */
		kicker: PlayerObject;
		/** Intensidade do chute comparado a velocidade máxima da bola (0-1) */
		intensity: number;
	};

	/** Evento disparado quando o goleiro faz uma defesa */
	"game:defense": {
		/** Jogador que fez a defesa */
		defender: PlayerObject;
		/** Intensidade da defesa comparando a velocidade que foi pega com a velocidade máxima da bola (0-1) */
		intensity: number;
	};

	/** Evento disparado quando o goleiro pega a bola que estava parada */
	"game:catch": {
		/** Jogador que pegou a bola */
		catcher: PlayerObject;
	};

	/** Evento disparado quando a posse de bola muda do time A para o time B, ou seja roubo de bola, sem que a bola tenha sido chutada ou seja no corpo a corpo */
	"game:steal": {
		/** Jogador que roubou a bola */
		thief: PlayerObject;
		/** Jogador que teve a posse de bola roubada */
		victim: PlayerObject;
	};

	/** Evento disparado quando um passe é feito, ou seja o último holder e o novo holder são do mesmo time sem a bola ter parado */
	// TODO: no futuro talvez seria interessante, a gente detectar se existe um aliado na trajetória do chute, e se tiver chamar de game:pass/shoot e depois quando receber game:pass/receive
	// Assim a gente pode até calcular passes que não foram efetivados, ou seja, quando o jogador tentou passar para um aliado mas a bola foi interceptada por um adversário, ou quando o jogador tentou passar para um aliado mas errou o passe e a bola parou no meio do caminho, ou seja, sem chegar no aliado.
	"game:pass": {
		/** Jogador que fez o passe */
		kicker: PlayerObject;
		/** Jogador que recebeu o passe */
		receiver: PlayerObject;
	};

	/** Evento disparado quando uma interceptação é feita, ou seja o último holder e o novo holder são de times diferentes sem a bola ter parado, e sem que a bola tenha um holder */
	"game:interception": {
		/** Jogador que fez a interceptação */
		interceptor: PlayerObject;
		/** Jogador que teve a posse de bola interceptada */
		intercepted: PlayerObject;
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
		/** Jogador que deixou a bola cair */
		dropper: PlayerObject;
	};

	/** Evento disparado quando o goleiro salta para tentar defender um chute */
	"game:goalkeeper/jump": {
		/** Goleiro que fez o salto */
		goalkeeper: PlayerObject;
		/** Duração do salto em turnos */
		duration: number;
		/** Intensidade do salto comparado a velocidade máxima do goleiro */
		intensity: number;
	};

	/** Evento disparado quando o goleiro aterrissa no chão após um salto */
	"game:goalkeeper/land": {
		/** Goleiro que fez o salto */
		goalkeeper: PlayerObject;
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

	batata: "seila";

	// #endregion
}

export type BasicEvent = keyof BasicEventData;
