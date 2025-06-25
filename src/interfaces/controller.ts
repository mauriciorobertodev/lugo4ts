import type { IBall } from '@/interfaces/ball.js';
import type { IFormation } from '@/interfaces/formation.js';
import type { IGameSnapshot } from '@/interfaces/game-snapshot.js';
import type { IPlayer } from '@/interfaces/player.js';
import type { IPoint } from '@/interfaces/positionable.js';
import type { IVelocity } from '@/interfaces/velocity.js';

import type { Environment } from '@/core/environment.js';
import type { Side } from '@/core/side.js';

export interface IGameController {
    nextTurn(): Promise<void>;
    nextOrder(): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    getGameSnapshot(): Promise<IGameSnapshot | null>;
    resumeListeningPhase(): Promise<void>;
    resetPlayerPositions(): Promise<IGameSnapshot>;
    resetBallPosition(): Promise<IGameSnapshot>;

    setTurn(turn: number): Promise<IGameSnapshot>;

    applyEnvironment(environment: Environment): Promise<IGameSnapshot>;

    addPlayer(player: IPlayer): Promise<IGameSnapshot>;
    setPlayerPosition(player: IPlayer, position: IPoint): Promise<IGameSnapshot>;
    setPlayerVelocity(player: IPlayer, velocity: IVelocity): Promise<IGameSnapshot>;
    setPlayerSpeed(player: IPlayer, speed: number): Promise<IGameSnapshot>;

    setBall(ball: IBall): Promise<IGameSnapshot>;
    setBallPosition(position: IPoint): Promise<IGameSnapshot>;
    setBallVelocity(velocity: IVelocity): Promise<IGameSnapshot>;
    setBallSpeed(speed: number): Promise<IGameSnapshot>;

    setTeamFormation(side: Side, formation: IFormation): Promise<void>;
    setHomeTeamFormation(formation: IFormation): Promise<void>;
    setAwayTeamFormation(formation: IFormation): Promise<void>;
}
