export class SPECS {
    // ───────────── General ─────────────

    /** Base unit of the game. 1 unit = 100 internal units. */
    static readonly BASE_UNIT = 100;

    // ───────────── Player ─────────────

    /** Player diameter: 400 units (4 * BASE_UNIT) */
    static readonly PLAYER_SIZE = 4 * SPECS.BASE_UNIT;

    /** Player radius: 200 units */
    static readonly PLAYER_RADIUS = SPECS.PLAYER_SIZE / 2;

    /** Penalty time (in turns) after a player reconnects: 20 turns */
    static readonly PLAYER_RECONNECTION_WAIT_TIME = 20;

    /** Maximum speed a player can move per turn: 100 units */
    static readonly PLAYER_MAX_SPEED = SPECS.BASE_UNIT;

    /** Maximum number of players per team: 11 */
    static readonly MAX_PLAYERS = 11;

    /** Minimum number of players per team to avoid W.O.: 6 */
    static readonly MIN_PLAYERS = 6;

    // ───────────── Field ─────────────

    /** Minimum X coordinate: 0 */
    static readonly MIN_X_COORDINATE = 0;

    /** Maximum X coordinate: 20,000 (200 * BASE_UNIT) */
    static readonly MAX_X_COORDINATE = 200 * SPECS.BASE_UNIT;

    /** Minimum Y coordinate: 0 */
    static readonly MIN_Y_COORDINATE = 0;

    /** Maximum Y coordinate: 10,000 (100 * BASE_UNIT) */
    static readonly MAX_Y_COORDINATE = 100 * SPECS.BASE_UNIT;

    /** X coordinate of the field center: 10,000 */
    static readonly CENTER_X_COORDINATE = SPECS.MAX_X_COORDINATE / 2;

    /** Y coordinate of the field center: 5,000 */
    static readonly CENTER_Y_COORDINATE = SPECS.MAX_Y_COORDINATE / 2;

    /** Radius of the center circle: 1,000 units */
    static readonly FIELD_CENTER_RADIUS = 1000;

    /** Diameter of the center circle: 2,000 units */
    static readonly FIELD_CENTER_DIAMETER = SPECS.FIELD_CENTER_RADIUS * 2;

    /** Total field width: 20,001 units (MAX + 1) */
    static readonly FIELD_WIDTH = SPECS.MAX_X_COORDINATE + 1;

    /** Total field height: 10,001 units (MAX + 1) */
    static readonly FIELD_HEIGHT = SPECS.MAX_Y_COORDINATE + 1;

    // ───────────── Ball ─────────────

    /** Ball diameter: 200 units (2 * BASE_UNIT) */
    static readonly BALL_SIZE = 2 * SPECS.BASE_UNIT;

    /** Ball radius: 100 units */
    static readonly BALL_RADIUS = SPECS.BALL_SIZE / 2;

    /** Ball deceleration per turn: 10 units */
    static readonly BALL_DECELERATION = 10;

    /** Ball acceleration (alias for negative deceleration): -10 units */
    static readonly BALL_ACCELERATION = -10;

    /** Maximum speed the ball can move per turn: 400 units (4 * BASE_UNIT) */
    static readonly BALL_MAX_SPEED = 4 * SPECS.BASE_UNIT;

    /** Minimum speed before the ball is considered stopped: 2 units */
    static readonly BALL_MIN_SPEED = 2;

    /** Maximum number of turns the ball can stay in the goal zone: 40 */
    static readonly BALL_MAX_TURNS_IN_GOAL_ZONE = 40;

    // ───────────── Goal ─────────────

    /** Vertical size of the goal (between posts): 3,000 units (30 * BASE_UNIT) */
    static readonly GOAL_SIZE = 30 * SPECS.BASE_UNIT;

    /** Y coordinate of the bottom post: 3,500 */
    static readonly GOAL_MIN_Y = (SPECS.MAX_Y_COORDINATE - SPECS.GOAL_SIZE) / 2;

    /** Y coordinate of the top post: 6,500 */
    static readonly GOAL_MAX_Y = SPECS.GOAL_MIN_Y + SPECS.GOAL_SIZE;

    /** Radius of the restricted zone near the goal: 1,400 units */
    static readonly GOAL_ZONE_RADIUS = 14 * SPECS.BASE_UNIT;

    // ───────────── Goalkeeper ─────────────

    /** Duration of the goalkeeper jump (in turns): 3 turns */
    static readonly GOALKEEPER_JUMP_TURNS_DURATION = 3;

    /** Maximum speed of the goalkeeper during jump: 200 units */
    static readonly GOALKEEPER_JUMP_MAX_SPEED = 2 * SPECS.BASE_UNIT;

    /** Fixed player number for the goalkeeper: 1 */
    static readonly GOALKEEPER_NUMBER = 1;

    /** Goalkeeper size (vertical bar): 920 units */
    static readonly GOALKEEPER_SIZE = SPECS.PLAYER_SIZE * 2.3;

    /** Half of the goalkeeper size: 460 units */
    static readonly GOALKEEPER_HALF_SIZE = SPECS.GOALKEEPER_SIZE / 2;

    // ───────────── Clock ─────────────

    /** Maximum possession time before turnover: 300 turns (~15s) */
    static readonly SHOT_CLOCK_TURNS = 300;
}
