import type { Side } from "@/core/side.js";
import type { Order } from "@/generated/server.js";
import type { IBot } from "@/interfaces/bot.interface.js";
import type { IGameInspector } from "@/interfaces/inspector.interface.js";

export interface IGameClient {
	getSide(): Side;
	getNumber(): number;
	playAsBot(bot: IBot, onJoin?: () => void): Promise<void>;
	play(callback: (inspector: IGameInspector) => Promise<Order[]>, onJoin?: () => void): Promise<void>;
}
