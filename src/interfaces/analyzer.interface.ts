/** biome-ignore-all lint/complexity/noBannedTypes: <.> */

import type { Event, EventData, EventMap } from "@/interfaces/events.interface.js";
import type { GameSnapshotObject } from "@/interfaces/snapshot.interface.js";

// T é o "buraco" para os eventos customizados. O padrão é vazio {}
export interface IAnalyzer<T extends EventMap = {}> {
	/**
	 * Método que recebe o snapshot atual do jogo e retorna uma lista de eventos customizados.
	 */
	compute(current: GameSnapshotObject): AnalyzedEvent<T>[];
}

// Esse tipo utilitário faz a mágica de juntar tudo
export type AnalyzedEvent<T extends EventMap = {}> = {
	[K in Event<T>]: {
		event: K;
		data: EventData<T, K>;
	};
}[Event<T>];
