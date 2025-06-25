import type { Side } from '@/core/side.js';

export interface IEnv {
    getGrpcUrl(): string;
    getGrpcInsecure(): boolean;
    getBotSide(): Side;
    getBotNumber(): number;
    getBotToken(): string;
}
