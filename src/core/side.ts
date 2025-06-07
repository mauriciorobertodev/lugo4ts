import { Team_Side } from '../generated/server.js';

import { ErrSideInvalid } from './errors.js';
import { Util } from './util.js';

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

    static toString(side: Side): string {
        switch (side) {
            case Side.HOME:
                return 'home';
            case Side.AWAY:
                return 'away';
            default:
                throw new ErrSideInvalid(side);
        }
    }

    static toInt(side: Side): number {
        switch (side) {
            case Side.HOME:
                return 0;
            case Side.AWAY:
                return 1;
            default:
                throw new ErrSideInvalid(side);
        }
    }

    static random(): Side {
        return SideFactory.fromInt(Util.randomInt(0, 1));
    }
}
