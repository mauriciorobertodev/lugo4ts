import { ErrSideInvalid } from './errors.js';

export enum Side {
    HOME = 'home',
    AWAY = 'away',
}

export class SideFactory {
    static fromString(value: string): Side {
        switch (value.toLowerCase()) {
            case 'home':
                return Side.HOME;
            case 'away':
                return Side.AWAY;
            default:
                throw new ErrSideInvalid(value);
        }
    }

    static fromInt(value: number): Side {
        switch (value) {
            case 0:
                return Side.HOME;
            case 1:
                return Side.AWAY;
            default:
                throw new ErrSideInvalid(value);
        }
    }
}
