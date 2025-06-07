import { Player } from './player.js';
import { Side } from './side.js';
import { Snapshot } from './snapshot.js';

export type Event = 'turn' | 'goal' | 'play' | 'pause' | 'over' | 'player-join' | 'player-leave';

export type EventData = {
    turn: { snapshot?: Snapshot };
    goal: { side: Side };
    play: {};
    pause: {};
    over: {};
    'player-join': { player?: Player };
    'player-leave': { player?: Player };
};

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
