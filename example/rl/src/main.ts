import { Gym } from "@/gym.js";
import { DummyStatue, Side } from "@/index.js";
import { EnvironmentOpponentHolder } from "./environments/opponent-holder.js";
import { GoalkeeperCatcherTrainer } from "./trainers/goalkeeper-catch.trainer.js";

const trainer = new GoalkeeperCatcherTrainer();
await trainer.init();

new Gym()
	.withServerAddress("localhost:6000")
	.withTraineeNumber(1)
	.withTraineeSide(Side.HOME)
	.withEnvironment(() => new EnvironmentOpponentHolder())
	.withMyBots(() => {
		return new DummyStatue();
	})
	.withOpponentBots(() => {
		return new DummyStatue();
	})
	.withTrainer(() => trainer)
	.withTurnDuration(1000)
	.start();
