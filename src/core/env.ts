import { ErrBotInvalidNumber, ErrEnvNeedToken } from './errors.js';
import { Side, SideFactory } from './side.js';
import { SPECS } from './specs.js';

export class Env {
    private grpcUrl: string;
    private grpcInsecure: boolean;
    private botSide: Side;
    private botNumber: number;
    private botToken: string;

    constructor({
        grpcUrl,
        grpcInsecure,
        botSide,
        botNumber,
        botToken,
    }: {
        grpcUrl?: string;
        grpcInsecure?: boolean;
        botSide?: Side;
        botNumber?: number;
        botToken?: string;
    } = {}) {
        this.grpcUrl = grpcUrl ?? process.env.BOT_GRPC_URL ?? 'localhost:5000';
        this.grpcInsecure = grpcInsecure ?? this.parseBoolean(process.env.BOT_GRPC_INSECURE ?? 'true');
        this.botSide = botSide ?? SideFactory.fromString((process.env.BOT_TEAM ?? '').toLowerCase());
        this.botNumber = botNumber ?? this.validateBotNumber(process.env.BOT_NUMBER ?? '');
        this.botToken = botToken ?? process.env.BOT_TOKEN ?? '';
        this.throwIfNeedToken();
    }

    public getGrpcUrl(): string {
        return this.grpcUrl;
    }

    public getGrpcInsecure(): boolean {
        return this.grpcInsecure;
    }

    public getBotSide(): Side {
        return this.botSide;
    }

    public getBotNumber(): number {
        return this.botNumber;
    }

    public getBotToken(): string {
        return this.botToken;
    }

    private validateBotNumber(botNumber: string): number {
        const number = parseInt(botNumber, 10);
        if (isNaN(number) || number < 1 || number > SPECS.MAX_PLAYERS) {
            throw new ErrBotInvalidNumber(botNumber);
        }
        return number;
    }

    private throwIfNeedToken(): void {
        if (!this.botToken && !this.grpcInsecure) {
            throw new ErrEnvNeedToken();
        }
    }

    private parseBoolean(value: string): boolean {
        return value.toLowerCase() === 'true';
    }
}
