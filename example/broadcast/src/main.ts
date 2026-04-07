import { GameController } from "@/runtime.js";

const controller = new GameController("localhost:6000");

controller.setupEventListeners();
