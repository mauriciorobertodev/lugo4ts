import type { Ball } from "@/core/ball.js";
import type { Formation } from "@/core/formation.js";
import type { Player } from "@/core/player.js";
import type { Point } from "@/core/point.js";
import type { ShotClock } from "@/core/shot-clock.js";
import { Side } from "@/core/side.js";
import type { Team } from "@/core/team.js";
import type { Vector2D } from "@/core/vector.js";
import type { Velocity } from "@/core/velocity.js";
import type { EnvironmentObject, IEnvironment } from "@/interfaces/environment.interface.js";

import { zeroedBall } from "@/utils/ball.utils.js";
import { randomPlayer } from "@/utils/player.utils.js";
import { randomTeam } from "@/utils/team.utils.js";

export class Environment implements IEnvironment {
	private name: string = "Sem nome";
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

	addPlayer(player: Player): this {
		this.getTeamBySideOrCreate(player.getTeamSide()).addPlayer(player);
		return this;
	}

	setHomeTeam(team: Team): this {
		if (team.getSide() !== Side.HOME) throw new Error("Home team must be on the HOME side");
		this.homeTeam = team;
		return this;
	}

	getHomePlayer(number: number): Player {
		return this.getHomeTeamOrCreate().getPlayer(number);
	}

	tryGetHomePlayer(number: number): Player | null {
		return this.getHomeTeamOrCreate().tryGetPlayer(number);
	}

	setHomeScore(score: number): this {
		this.getHomeTeamOrCreate().setScore(score);
		return this;
	}

	setAwayTeam(team: Team): this {
		if (team.getSide() !== Side.AWAY) throw new Error("Away team must be on the AWAY side");
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

	tryGetAwayPlayer(number: number): Player | null {
		return this.getAwayTeamOrCreate().tryGetPlayer(number);
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
		if (!this.homeTeam) {
			this.homeTeam = randomTeam({
				score: 0,
				name: "Home Team",
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
		}

		return this.homeTeam!;
	}

	private getAwayTeamOrCreate(): Team {
		if (!this.awayTeam)
			this.awayTeam = randomTeam({
				score: 0,
				name: "Away Team",
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
		return this.awayTeam!;
	}

	private getBallOrCreate(): Ball {
		if (!this.ball) this.ball = zeroedBall();
		return this.ball!;
	}

	setShotClock(shotClock: ShotClock): this {
		this.shotClock = shotClock;
		return this;
	}

	toObject(): EnvironmentObject {
		return {
			name: this.name,
			turn: this.turn ?? undefined,
			ball: this.ball?.toObject(),
			homeTeam: this.homeTeam?.toObject(),
			awayTeam: this.awayTeam?.toObject(),
			shotClock: this.shotClock?.toObject(),
		};
	}

	toJsonString(): string {
		return JSON.stringify(this.toObject(), null, 4);
	}
}
