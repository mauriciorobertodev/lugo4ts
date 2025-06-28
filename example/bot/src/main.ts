import { Mapper } from 'core/mapper.js';
import { Client } from 'runtime/client.js';
import { Env } from 'runtime/env.js';
import { enableLogs } from 'utils/logger.js';

import { BotTester } from './bot.js';
import { MAPPER_COLS, MAPPER_ROWS, PLAYER_INITIAL_POSITIONS } from './settings.js';

enableLogs();

const env = new Env();

const mapper = new Mapper(MAPPER_COLS, MAPPER_ROWS, env.getBotSide());

const initRegion = PLAYER_INITIAL_POSITIONS[env.getBotNumber()];

const initPosition = mapper.getRegion(initRegion.col, initRegion.row).getCenter();

const bot = new BotTester(mapper);

const client = new Client(env.getGrpcUrl(), env.getBotToken(), env.getBotSide(), env.getBotNumber(), initPosition);

client.playAsBot(bot);
