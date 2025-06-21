import { Ball, Formation, Player, Point, ShotClock, Side, Team, Vector2D, Velocity } from '@/core.js';
import { randomPlayer, randomTeam, zeroedBall } from '@/utils.js';

export class Environment {
    private name: string = '';
    private turn: number | null = null;
    private ball: Ball | null = null;
    private homeTeam: Team | null = null;
    private awayTeam: Team | null = null;
    private shotClock: ShotClock | null = null;

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

    setBall(ball: Ball): this {
        this.ball = ball;
        return this;
    }

    getBall(): Ball | null {
        return this.ball;
    }

    setBallPosition(position: Point): this {
        this.getBallOrCreate().setPosition(position);
        return this;
    }

    setBallVelocity(velocity: Velocity): this {
        this.getBallOrCreate().setVelocity(velocity);
        return this;
    }

    setBallDirection(direction: Vector2D): this {
        this.getBallOrCreate().setVelocity(this.getBallOrCreate().getVelocity().setDirection(direction));
        return this;
    }

    setBallSpeed(speed: number): this {
        this.getBallOrCreate().setVelocity(this.getBallOrCreate().getVelocity().setSpeed(speed));
        return this;
    }

    setBallHolder(holder: Player | null): this {
        // TODO: definir a posição da bola com base no holder
        this.getBallOrCreate().setHolder(holder);
        return this;
    }

    setPlayer(player: Player): this {
        this.getTeamBySideOrCreate(player.getTeamSide()).setPlayer(player);
        return this;
    }

    setHomeTeam(team: Team): this {
        if (team.getSide() !== Side.HOME) throw new Error('Home team must be on the HOME side');
        this.homeTeam = team;
        return this;
    }

    getHomePlayer(number: number): Player {
        return this.getHomeTeamOrCreate().getPlayer(number);
    }

    setHomeScore(score: number): this {
        this.getHomeTeamOrCreate().setScore(score);
        return this;
    }

    setAwayTeam(team: Team): this {
        if (team.getSide() !== Side.AWAY) throw new Error('Away team must be on the AWAY side');
        this.awayTeam = team;
        return this;
    }

    setAwayScore(score: number): this {
        this.getAwayTeamOrCreate().setScore(score);
        return this;
    }

    getAwayPlayer(number: number): Player {
        return this.getAwayTeamOrCreate().getPlayer(number);
    }

    setHomeTeamPositionsByFormation(formation: Formation): this {
        this.getHomeTeamOrCreate().setPositionsByFormation(formation);
        return this;
    }

    setAwayTeamPositionsByFormation(formation: Formation): this {
        this.getAwayTeamOrCreate().setPositionsByFormation(formation);
        return this;
    }

    tryGetPlayerByNumberAndSide(number: number, side: Side): Player | null {
        if (side === Side.HOME) {
            return this.getHomeTeamOrCreate().tryGetPlayer(number);
        } else {
            return this.getAwayTeamOrCreate().tryGetPlayer(number);
        }
    }

    getHomeTeam(): Team | null {
        return this.homeTeam;
    }

    getAwayTeam(): Team | null {
        return this.awayTeam;
    }

    getHomePlayers(): Player[] {
        return this.getHomeTeam()?.getPlayers() || [];
    }

    getAwayPlayers(): Player[] {
        return this.getAwayTeam()?.getPlayers() || [];
    }

    getShotClock(): ShotClock | null {
        return this.shotClock;
    }

    private getTeamBySideOrCreate(side: Side): Team {
        if (side === Side.HOME) return this.getHomeTeamOrCreate();
        return this.getAwayTeamOrCreate();
    }

    private getHomeTeamOrCreate(): Team {
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

    private getAwayTeamOrCreate(): Team {
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

    private getBallOrCreate(): Ball {
        if (!this.ball) this.ball = zeroedBall();
        return this.ball;
    }
}
