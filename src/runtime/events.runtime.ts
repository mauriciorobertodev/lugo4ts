import type { GameSnapshot } from "@/core/game-snapshot.js";
import type { Player } from "@/core/player.js";
import type { Side } from "@/core/side.js";
import type { ServerState } from "@/interfaces/snapshot.interface.js";

export type Event = "goal" | "play" | "pause" | "over" | "joined" | "leaved" | "changed";

export type EventData = {
	goal: { side: Side };
	play: { snapshot?: GameSnapshot };
	pause: { snapshot?: GameSnapshot };
	over: { snapshot?: GameSnapshot };
	joined: { player?: Player };
	leaved: { player?: Player };
	changed: { prevState: ServerState; newState: ServerState; snapshot?: GameSnapshot };
};

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
