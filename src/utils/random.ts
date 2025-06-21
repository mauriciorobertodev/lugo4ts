export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomElement<T>(array: T[]): T {
    if (array.length === 0) throw new Error('Array cannot be empty');
    return array[randomInt(0, array.length - 1)];
}
