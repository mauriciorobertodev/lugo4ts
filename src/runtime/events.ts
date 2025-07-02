import { ServerState } from '@/interfaces/game-snapshot.js';

import { GameSnapshot } from '@/core/game-snapshot.js';
import { Player } from '@/core/player.js';
import { Side } from '@/core/side.js';

export type Event = 'turn' | 'goal' | 'play' | 'pause' | 'over' | 'player-join' | 'player-leave' | 'state-changed';

export type EventData = {
    turn: { snapshot?: GameSnapshot };
    goal: { side: Side };
    play: {};
    pause: {};
    over: {};
    'player-join': { player?: Player };
    'player-leave': { player?: Player };
    'state-changed': { prevState: ServerState; newState: ServerState; snapshot?: GameSnapshot };
};

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
