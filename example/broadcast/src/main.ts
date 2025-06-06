import { GameController } from '../../../src/core/controller.js';

const controller = new GameController('localhost:6000');

controller.setupEventListeners();
