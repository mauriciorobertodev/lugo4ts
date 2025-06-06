import type { Side } from '../core/side.js';
import type { IBall } from './ball.js';
import type { IFormation } from './formation.js';
import type { IPlayer } from './player.js';
import type { IPoint } from './positionable.js';
import type { ISnapshot } from './snapshot.js';
import type { IVelocity } from './velocity.js';

export interface IGameController {
    goToNextTurn(): Promise<void>;
    goToNextOrder(): Promise<void>;
    play(): Promise<void>;
    pause(): Promise<void>;
    getGameSnapshot(): Promise<ISnapshot | null>;
    resetPlayerPositions(): Promise<void>;
    resetBallPosition(): Promise<void>;

    setPlayer(player: IPlayer): Promise<void>;
    setPlayerPosition(player: IPlayer, position: IPoint): Promise<void>;
    setPlayerVelocity(player: IPlayer, velocity: IVelocity): Promise<void>;
    setPlayerSpeed(player: IPlayer, speed: number): Promise<void>;

    setBall(ball: IBall): Promise<void>;
    setBallPosition(position: IPoint): Promise<void>;
    setBallVelocity(velocity: IVelocity): Promise<void>;
    setBallSpeed(speed: number): Promise<void>;

    setTeamFormation(side: Side, formation: IFormation): Promise<void>;
    setHomeTeamFormation(formation: IFormation): Promise<void>;
    setAwayTeamFormation(formation: IFormation): Promise<void>;
}
