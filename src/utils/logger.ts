import { Side } from "@/core/side.js";

type LogLevel = "debug" | "info" | "success" | "warn" | "error";
type LogLevelSetting = LogLevel;

const LEVEL_PRIORITY: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	success: 2,
	warn: 3,
	error: 4,
};

const colors: Record<LogLevel | "reset", string> = {
	reset: "\x1b[0m",
	debug: "\x1b[90m",
	info: "\x1b[34m",
	success: "\x1b[32m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
};

class Logger {
	private enabled = true;
	private level: LogLevelSetting = "debug";

	private playerNumber?: number;
	private playerSide?: Side;
	private playerState?: string;

	enable() {
		this.enabled = true;
	}

	disable() {
		this.enabled = false;
	}

	setLevel(level: LogLevelSetting) {
		this.level = level;
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	setPlayer({ playerNumber, playerSide, playerState }: { playerNumber?: number; playerSide?: Side; playerState?: string }) {
		this.playerNumber = playerNumber;
		this.playerSide = playerSide;
		this.playerState = playerState;
	}

	private getPrefix(): string {
		const parts = [
			this.playerNumber !== undefined ? `[${this.playerNumber}]` : null,
			this.playerSide !== undefined ? `[${this.playerSide}]` : null,
			this.playerState !== undefined ? `[${this.playerState.toUpperCase()}]` : null,
		].filter(Boolean);
		return parts.join(" ");
	}

	private formatTime(): string {
		const now = new Date();
		return now.toLocaleTimeString("pt-BR", { hour12: false });
	}

	private shouldLog(level: LogLevel): boolean {
		return this.enabled && LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.level];
	}

	private log(level: LogLevel, message: any, ...args: any[]) {
		if (!this.shouldLog(level)) return;
		const time = this.formatTime();
		const prefix = this.getPrefix();
		const color = colors[level];
		const reset = colors.reset;

		const label = `${color}${time} ${prefix}${reset}`;
		console.log(label, message, ...args);
	}

	debug(msg: any, ...args: any[]) {
		this.log("debug", msg, ...args);
	}

	info(msg: any, ...args: any[]) {
		this.log("info", msg, ...args);
	}

	success(msg: any, ...args: any[]) {
		this.log("success", msg, ...args);
	}

	warn(msg: any, ...args: any[]) {
		this.log("warn", msg, ...args);
	}

	danger(msg: any, ...args: any[]) {
		this.log("error", msg, ...args);
	}

	error(msg: any, ...args: any[]) {
		this.danger(msg, ...args);
	}
}

export const logger = new Logger();
