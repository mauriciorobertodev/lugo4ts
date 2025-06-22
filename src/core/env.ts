import { IEnv } from '@/interfaces.js';

import { Side } from '@/core/side.js';
import { SPECS } from '@/core/specs.js';

import { isValidPlayerNumber } from '@/utils.js';
import { stringToSide } from '@/utils/side.js';

import { ErrBotInvalidNumber, ErrEnvNeedToken } from '@/errors.js';

export class Env implements IEnv {
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
        this.grpcUrl = grpcUrl || process.env.BOT_GRPC_URL || 'localhost:5000';
        this.grpcInsecure = grpcInsecure ?? this.parseBoolean(process.env.BOT_GRPC_INSECURE || 'true');
        this.botSide = botSide ?? stringToSide((process.env.BOT_TEAM ?? '').toLowerCase());
        this.botNumber = botNumber ?? this.validateBotNumber(process.env.BOT_NUMBER ?? '');
        this.botToken = botToken ?? process.env.BOT_TOKEN ?? '';
        this.throwIfNeedToken();
    }

    getGrpcUrl(): string {
        return this.grpcUrl;
    }

    getGrpcInsecure(): boolean {
        return this.grpcInsecure;
    }

    getBotSide(): Side {
        return this.botSide;
    }

    getBotNumber(): number {
        return this.botNumber;
    }

    getBotToken(): string {
        return this.botToken;
    }

    private validateBotNumber(botNumber: string): number {
        const number = parseInt(botNumber, 10);
        if (!isValidPlayerNumber(number)) {
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
