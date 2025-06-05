import type { Side } from '../side.ts';

export interface IEnv {
    getGrpcUrl(): string;
    getGrpcInsecure(): boolean;
    getBotSide(): Side;
    getBotNumber(): number;
    getBotToken(): string;
}
