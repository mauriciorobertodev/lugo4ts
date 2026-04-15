import { GameController } from "@mauricioroberto/lugo4ts/runtime";

const controller = new GameController("localhost:6000");

controller.on("connection:started", ({ setup, snapshot }) => {
	console.log("✅ Conectado ao servidor");
	console.log("Setup:", setup);
	console.log("Snapshot:", snapshot);
});

controller.on("game:changed", ({ prevState, newState }) => {
	console.log(`[STATE CHANGE] ${prevState} → ${newState}`);
});

controller.on("game:goal", ({ side, snapshot }) => {
	console.log(`[GOAL] Time ${side} marcou! Turno: ${snapshot?.turn}`);
});

controller.on("game:over", ({ reason }) => {
	console.log(`[GAME OVER] Motivo: ${reason}`);
});

await controller.connect();
