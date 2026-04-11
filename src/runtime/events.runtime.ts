import type { GameSnapshot } from "@/core/game-snapshot.js";
import type { Player } from "@/core/player.js";
import type { Side } from "@/core/side.js";
import type { GameOverReason } from "@/interfaces/controller.interface.js";
import type { ServerState } from "@/interfaces/snapshot.interface.js";

export type EventData = {
	"game:goal": { side: Side; snapshot?: GameSnapshot };
	"game:playing": { snapshot?: GameSnapshot };
	"game:paused": { snapshot?: GameSnapshot };
	"game:over": { snapshot?: GameSnapshot; reason: GameOverReason };
	"game:joined": { player: Player; snapshot?: GameSnapshot };
	"game:leaved": { player: Player; snapshot?: GameSnapshot };
	"game:changed": { prevState: ServerState; newState: ServerState; snapshot?: GameSnapshot };

	"stream:started": null;
	"stream:ended": null;
	"stream:error": { error: string };
};

export type Event = keyof EventData;

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
