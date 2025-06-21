import { Side } from '@/core.js';

export function intToSide(side: number): Side {
    return side === 0 ? Side.HOME : Side.AWAY;
}

export function stringToSide(side: string): Side {
    if (side.toLowerCase() === 'home') return Side.HOME;
    if (side.toLowerCase() === 'away') return Side.AWAY;
    throw new Error(`Invalid side: ${side}`);
}

export function flipSide(side: Side): Side {
    return side === Side.HOME ? Side.AWAY : Side.HOME;
}

export function sideToInt(side: Side): number {
    return side === Side.HOME ? 0 : 1;
}

export function randomSide(): Side {
    return Math.random() < 0.5 ? Side.HOME : Side.AWAY;
}
