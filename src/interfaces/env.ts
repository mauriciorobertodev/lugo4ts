import type { Side } from '@/core.js';

export interface IEnv {
    getGrpcUrl(): string;
    getGrpcInsecure(): boolean;
    getBotSide(): Side;
    getBotNumber(): number;
    getBotToken(): string;
}
