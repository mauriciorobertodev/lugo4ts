export class Util {
    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    static lerp(start: number, end: number, t: number): number {
        return start + (end - start) * t;
    }

    static isBetween(value: number, min: number, max: number): boolean {
        return value >= min && value <= max;
    }

    static randomElement<T>(array: T[]): T {
        if (array.length === 0) {
            throw new Error('Array cannot be empty');
        }
        const randomIndex = this.randomInt(0, array.length - 1);
        return array[randomIndex];
    }
}
