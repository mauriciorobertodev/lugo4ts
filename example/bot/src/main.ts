import { Mapper, logger } from "@mauricioroberto/lugo4ts";
import { Env, GameClient } from "@mauricioroberto/lugo4ts/runtime";

import { BotTester } from "./bot.js";
import { MAPPER_COLS, MAPPER_ROWS, PLAYER_INITIAL_POSITIONS } from "./settings.js";

logger.enable();

const env = new Env();

const mapper = new Mapper(MAPPER_COLS, MAPPER_ROWS);

const initRegion = PLAYER_INITIAL_POSITIONS[env.getBotNumber()];

const initPosition = mapper.getRegion(initRegion.col, initRegion.row).getCenter();

const bot = new BotTester(mapper);

const client = new GameClient(env.getGrpcUrl(), env.getBotToken(), env.getBotSide(), env.getBotNumber(), initPosition);

client.playAsBot(bot);
