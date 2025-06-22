import { IBall, IFormation, IPlayer, IPoint, IShotClock, ITeam, IVector2D, IVelocity } from '@/interfaces.js';

import { Ball, Formation, Player, Point, ShotClock, Side, Team, Vector2D, Velocity } from '@/core.js';

import { randomPlayer, randomTeam, zeroedBall } from '@/utils.js';

export class Environment {
    private name: string = '';
    private turn: number | null = null;
    private ball: IBall | null = null;
    private homeTeam: ITeam | null = null;
    private awayTeam: ITeam | null = null;
    private shotClock: IShotClock | null = null;

    constructor() {
        this.name = crypto.randomUUID();
    }

    getTurn(): number | null {
        return this.turn;
    }

    setTurn(turn: number): this {
        this.turn = turn;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    getName(): string {
        return this.name;
    }

    setBall(ball: IBall): this {
        this.ball = ball;
        return this;
    }

    getBall(): IBall | null {
        return this.ball;
    }

    setBallPosition(position: IPoint): this {
        this.getBallOrCreate().setPosition(position);
        return this;
    }

    setBallVelocity(velocity: IVelocity): this {
        this.getBallOrCreate().setVelocity(velocity);
        return this;
    }

    setBallDirection(direction: IVector2D): this {
        this.getBallOrCreate().setVelocity(this.getBallOrCreate().getVelocity().setDirection(direction));
        return this;
    }

    setBallSpeed(speed: number): this {
        this.getBallOrCreate().setVelocity(this.getBallOrCreate().getVelocity().setSpeed(speed));
        return this;
    }

    setBallHolder(holder: IPlayer | null): this {
        // TODO: definir a posição da bola com base no holder
        this.getBallOrCreate().setHolder(holder);
        return this;
    }

    addPlayer(player: IPlayer): this {
        this.getTeamBySideOrCreate(player.getTeamSide()).addPlayer(player);
        return this;
    }

    setHomeTeam(team: ITeam): this {
        if (team.getSide() !== Side.HOME) throw new Error('Home team must be on the HOME side');
        this.homeTeam = team;
        return this;
    }

    getHomePlayer(number: number): IPlayer {
        return this.getHomeTeamOrCreate().getPlayer(number);
    }

    setHomeScore(score: number): this {
        this.getHomeTeamOrCreate().setScore(score);
        return this;
    }

    setAwayTeam(team: ITeam): this {
        if (team.getSide() !== Side.AWAY) throw new Error('Away team must be on the AWAY side');
        this.awayTeam = team;
        return this;
    }

    setAwayScore(score: number): this {
        this.getAwayTeamOrCreate().setScore(score);
        return this;
    }

    getAwayPlayer(number: number): IPlayer {
        return this.getAwayTeamOrCreate().getPlayer(number);
    }

    setHomeTeamPositionsByFormation(formation: IFormation): this {
        this.getHomeTeamOrCreate().setPositionsByFormation(formation);
        return this;
    }

    setAwayTeamPositionsByFormation(formation: IFormation): this {
        this.getAwayTeamOrCreate().setPositionsByFormation(formation);
        return this;
    }

    tryGetPlayerByNumberAndSide(number: number, side: Side): IPlayer | null {
        if (side === Side.HOME) {
            return this.getHomeTeamOrCreate().tryGetPlayer(number);
        } else {
            return this.getAwayTeamOrCreate().tryGetPlayer(number);
        }
    }

    getHomeTeam(): ITeam | null {
        return this.homeTeam;
    }

    getAwayTeam(): ITeam | null {
        return this.awayTeam;
    }

    getHomePlayers(): IPlayer[] {
        return this.getHomeTeam()?.getPlayers() || [];
    }

    getAwayPlayers(): IPlayer[] {
        return this.getAwayTeam()?.getPlayers() || [];
    }

    getShotClock(): IShotClock | null {
        return this.shotClock;
    }

    private getTeamBySideOrCreate(side: Side): ITeam {
        if (side === Side.HOME) return this.getHomeTeamOrCreate();
        return this.getAwayTeamOrCreate();
    }

    private getHomeTeamOrCreate(): ITeam {
        if (!this.homeTeam)
            this.homeTeam = randomTeam({
                score: 0,
                name: 'Home Team',
                side: Side.HOME,
                players: [
                    randomPlayer({ number: 1, side: Side.HOME }),
                    randomPlayer({ number: 2, side: Side.HOME }),
                    randomPlayer({ number: 3, side: Side.HOME }),
                    randomPlayer({ number: 4, side: Side.HOME }),
                    randomPlayer({ number: 5, side: Side.HOME }),
                    randomPlayer({ number: 6, side: Side.HOME }),
                    randomPlayer({ number: 7, side: Side.HOME }),
                    randomPlayer({ number: 8, side: Side.HOME }),
                    randomPlayer({ number: 9, side: Side.HOME }),
                    randomPlayer({ number: 10, side: Side.HOME }),
                    randomPlayer({ number: 11, side: Side.HOME }),
                ],
            });
        return this.homeTeam;
    }

    private getAwayTeamOrCreate(): ITeam {
        if (!this.awayTeam)
            this.awayTeam = randomTeam({
                score: 0,
                name: 'Away Team',
                side: Side.AWAY,
                players: [
                    randomPlayer({ number: 1, side: Side.AWAY }),
                    randomPlayer({ number: 2, side: Side.AWAY }),
                    randomPlayer({ number: 3, side: Side.AWAY }),
                    randomPlayer({ number: 4, side: Side.AWAY }),
                    randomPlayer({ number: 5, side: Side.AWAY }),
                    randomPlayer({ number: 6, side: Side.AWAY }),
                    randomPlayer({ number: 7, side: Side.AWAY }),
                    randomPlayer({ number: 8, side: Side.AWAY }),
                    randomPlayer({ number: 9, side: Side.AWAY }),
                    randomPlayer({ number: 10, side: Side.AWAY }),
                    randomPlayer({ number: 11, side: Side.AWAY }),
                ],
            });
        return this.awayTeam;
    }

    private getBallOrCreate(): IBall {
        if (!this.ball) this.ball = zeroedBall();
        return this.ball;
    }
}
