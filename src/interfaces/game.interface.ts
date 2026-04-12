export enum GameState {
	/** O jogo está aguardando os jogadores para começar */
	WAITING = "waiting",
	/** O jogo está em andamento */
	PLAYING = "playing",
	/** O jogo está pausado */
	PAUSED = "paused",
	/** O jogo terminou */
	OVER = "over",
}

export enum GameOverReason {
	/**
	 * Termino normal, o jogo rodou até o final do número esperado de turnos
	 */
	TIME_IS_OVER = "time_is_over",

	/**
	 * O jogo não chegou a começar. Um dos times ou ambos os times não tinham 11 bots conectados
	 */
	WAITING_EXPIRED = "waiting_expired",

	/**
	 * O jogo foi interrompido porque muitos bots de pelo menos um dos times desconectaram.
	 */
	NO_ENOUGH_PLAYER = "no_enough_player",

	/**
	 * O jogo foi interrompido por um comando externo (foi parado)
	 */
	EXTERNAL_REQUEST = "external_request",

	/**
	 * O jogo foi interrompido porque a diferença de gols é muito grande para o tempo restante.
	 * Culpa do time nocauteado
	 */
	KNOCKOUT = "knockout",
}
