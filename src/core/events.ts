import { Side } from '@/core.js';
import { IGameSnapshot, IPlayer } from '@/interfaces.js';

export type Event = 'turn' | 'goal' | 'play' | 'pause' | 'over' | 'player-join' | 'player-leave';

export type EventData = {
    turn: { snapshot?: IGameSnapshot };
    goal: { side: Side };
    play: {};
    pause: {};
    over: {};
    'player-join': { player?: IPlayer };
    'player-leave': { player?: IPlayer };
};

export type GenericEventListener = <K extends Event>(event: K, data: EventData[K]) => void;
