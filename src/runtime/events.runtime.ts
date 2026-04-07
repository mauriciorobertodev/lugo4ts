import type { GameSnapshot } from "@/core/game-snapshot.js";
import type { Player } from "@/core/player.js";
import type { Side } from "@/core/side.js";
import type { ServerState } from "@/interfaces/snapshot.interface.js";

export type Event = "turn" | "goal" | "play" | "pause" | "over" | "player-join" | "player-leave" | "state-changed";

export type EventData = {
	turn: { snapshot?: GameSnapshot };
	goal: { side: Side };
	play: null;
	pause: null;
	over: null;
	"player-join": { player?: Player };
	"player-leave": { player?: Player };
	"state-changed": { prevState: ServerState; newState: ServerState; snapshot?: GameSnapshot };
};

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
