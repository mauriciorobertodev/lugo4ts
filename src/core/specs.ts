export class SPECS {
    static readonly BASE_UNIT = 100;

    static readonly PLAYER_SIZE = 4 * SPECS.BASE_UNIT;
    static readonly PLAYER_RADIUS = SPECS.PLAYER_SIZE / 2;
    static readonly PLAYER_RECONNECTION_WAIT_TIME = 20;
    static readonly PLAYER_MAX_SPEED = 100.0;

    static readonly MAX_PLAYERS = 11;
    static readonly MIN_PLAYERS = 6;

    static readonly MAX_X_COORDINATE = 200 * SPECS.BASE_UNIT;
    static readonly MAX_Y_COORDINATE = 100 * SPECS.BASE_UNIT;

    static readonly FIELD_NEUTRAL_CENTER = 1000;
    static readonly FIELD_CENTER_RADIUS = 1000;

    static readonly FIELD_WIDTH = SPECS.MAX_X_COORDINATE + 1;
    static readonly FIELD_HEIGHT = SPECS.MAX_Y_COORDINATE + 1;

    static readonly FIELD_CENTER_X = SPECS.MAX_X_COORDINATE / 2;
    static readonly FIELD_CENTER_Y = SPECS.MAX_Y_COORDINATE / 2;

    static readonly BALL_SIZE = 2 * SPECS.BASE_UNIT;
    static readonly BALL_RADIUS = SPECS.BALL_SIZE / 2;
    static readonly BALL_DECELERATION = 10.0;
    static readonly BALL_ACCELERATION = -10.0;
    static readonly BALL_MAX_SPEED = 4.0 * SPECS.BASE_UNIT;
    static readonly BALL_MIN_SPEED = 2;
    static readonly BALL_TIME_IN_GOAL_ZONE = 40; // 40 / 20 fps : 2 seconds

    static readonly GOAL_WIDTH = 30 * SPECS.BASE_UNIT;
    static readonly GOAL_MIN_Y = (SPECS.MAX_Y_COORDINATE - SPECS.GOAL_WIDTH) / 2;
    static readonly GOAL_MAX_Y = (SPECS.MAX_Y_COORDINATE - SPECS.GOAL_WIDTH) / 2 + SPECS.GOAL_WIDTH;
    static readonly GOAL_ZONE_RANGE = 14 * SPECS.BASE_UNIT;

    static readonly GOALKEEPER_JUMP_DURATION = 3;
    static readonly GOALKEEPER_JUMP_MAX_SPEED = 2 * SPECS.BASE_UNIT;
    static readonly GOALKEEPER_NUMBER = 1;
    static readonly GOALKEEPER_SIZE = SPECS.PLAYER_SIZE * 2.3;

    static readonly SHOT_CLOCK_TIME = 300;
}
