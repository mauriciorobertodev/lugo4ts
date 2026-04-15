/**
 * Testes manuais para validar operações do GameController.
 * Rode com: npx tsx example/broadcast/src/test.ts
 * O servidor Lugo deve estar rodando em localhost:6000.
 */

import { type CoreEventData, Environment, type Event, Point, randomPointInField, Side, StartInlineFormation } from "@mauricioroberto/lugo4ts";
import { GameController } from "@mauricioroberto/lugo4ts/runtime";

const controller = new GameController("localhost:6000");

function waitForEvent<K extends Event>(event: K, timeoutMs = 600): Promise<CoreEventData[K & keyof CoreEventData] | null> {
	return new Promise((resolve) => {
		const timer = setTimeout(() => {
			resolve(null);
		}, timeoutMs);

		controller.on(event as any, (data: any) => {
			clearTimeout(timer);
			resolve(data);
		});
	});
}

let passed = 0;
let failed = 0;

function assert(label: string, expected: unknown, actual: unknown, tolerance = 0) {
	const ok = typeof expected === "number" && typeof actual === "number" ? Math.abs(expected - actual) <= tolerance : expected === actual;

	if (ok) {
		console.log(`  ✅ ${label}`);
		passed++;
	} else {
		console.error(`  ❌ ${label} — esperado: ${expected}, recebido: ${actual}`);
		failed++;
	}
}

function assertFormation(label: string, formation: StartInlineFormation, players: ReturnType<typeof Array.prototype.find>[] | undefined, skip: number[] = []) {
	let allOk = true;
	for (let number = 1; number <= 11; number++) {
		if (skip.includes(number)) continue;
		const expected = formation.getPositionOf(number);
		const player = players?.find((p: any) => p.getNumber() === number);
		if (!player) {
			console.error(`  ❌ ${label} jogador ${number} não encontrado no snapshot`);
			failed++;
			allOk = false;
			continue;
		}
		const actual = (player as any).getPosition();
		const ok = actual.getX() === expected.getX() && actual.getY() === expected.getY();
		if (!ok) {
			console.error(`  ❌ ${label} ${number} — esperado (${expected.getX()}, ${expected.getY()}), recebido (${actual.getX()}, ${actual.getY()})`);
			failed++;
			allOk = false;
		}
	}
	if (allOk) {
		const skipNote = skip.length ? ` (pulando jogador${skip.length > 1 ? "es" : ""} ${skip.join(", ")})` : "";
		console.log(`  ✅ jogadores ${label} na posição correta${skipNote}`);
		passed++;
	}
}

controller.on("connection:started", async () => {
	console.log("✅ Conectado ao servidor\n");

	// --- [1] setBallPosition aleatório ---
	console.log("🧪 [1] setBallPosition");
	{
		const pos = randomPointInField();
		await controller.setBallPosition(pos);
		const snapshot = await controller.getGameSnapshot();
		const ball = snapshot?.getBall();
		assert("bola.x", pos.getX(), ball?.getPosition().getX());
		assert("bola.y", pos.getY(), ball?.getPosition().getY());
	}

	// --- [2] resetBallPosition ---
	console.log("\n🧪 [2] resetBallPosition (centro)");
	{
		await controller.resetBallPosition();
		const snapshot = await controller.getGameSnapshot();
		const ball = snapshot?.getBall();
		assert("bola.x no centro", 10000, ball?.getPosition().getX());
		assert("bola.y no centro", 5000, ball?.getPosition().getY());
	}

	// --- [3] setPlayerPosition ---
	console.log("\n🧪 [3] setPlayerPosition");
	{
		const pos = new Point(3000, 2500);
		await controller.setPlayerPosition(Side.HOME, 2, pos);
		const snapshot = await controller.getGameSnapshot();
		const player = snapshot?.getHomePlayers().find((p) => p.getNumber() === 2);
		assert("jogador HOME 2 x", pos.getX(), player?.getPosition().getX());
		assert("jogador HOME 2 y", pos.getY(), player?.getPosition().getY());
	}

	// --- [4] setHomeTeamFormation ---
	console.log("\n🧪 [4] setHomeTeamFormation");
	{
		const formation = new StartInlineFormation();
		await controller.setHomeTeamFormation(formation);
		const snapshot = await controller.getGameSnapshot();
		assertFormation("HOME", formation, snapshot?.getHomePlayers());
	}

	// --- [5] setAwayTeamFormation ---
	console.log("\n🧪 [5] setAwayTeamFormation");
	{
		const formation = new StartInlineFormation();
		await controller.setAwayTeamFormation(formation);
		const snapshot = await controller.getGameSnapshot();
		// Goleiro (1) é pulado: servidor força X=20000 para goleiro AWAY independente do valor enviado
		assertFormation("AWAY", formation, snapshot?.getAwayPlayers(), [1]);
	}

	// --- [6] applyEnvironment (bola + ambos os times + turno) ---
	console.log("\n🧪 [6] applyEnvironment");
	{
		const ballPos = new Point(7500, 3000);
		const homeFormation = new StartInlineFormation();
		const awayFormation = new StartInlineFormation();
		const turn = 42;

		const env = new Environment()
			.setName("teste")
			.setBallPosition(ballPos)
			.setTurn(turn)
			.setHomeTeamPositionsByFormation(homeFormation)
			.setAwayTeamPositionsByFormation(awayFormation);

		await controller.applyEnvironment(env);
		const snapshot = await controller.getGameSnapshot();

		assert("bola.x", ballPos.getX(), snapshot?.getBall()?.getPosition().getX());
		assert("bola.y", ballPos.getY(), snapshot?.getBall()?.getPosition().getY());
		assert("turno", turn, snapshot?.getTurn());
		assertFormation("HOME (env)", homeFormation, snapshot?.getHomePlayers());
		assertFormation("AWAY (env)", awayFormation, snapshot?.getAwayPlayers());
	}

	// --- [7] resetPlayerPositions ---
	console.log("\n🧪 [7] resetPlayerPositions");
	{
		// move jogadores pra uma posição conhecida
		await controller.setPlayerPosition(Side.HOME, 3, new Point(1000, 1000));
		await controller.setPlayerPosition(Side.AWAY, 3, new Point(1000, 1000));

		await controller.resetPlayerPositions();
		const snapshot = await controller.getGameSnapshot();

		// após resetPlayerPositions o servidor deve colocar o estado como READY
		const { ServerState } = await import("@mauricioroberto/lugo4ts");
		console.debug("Estado após resetPlayerPositions:", snapshot?.getState());
		assert("estado pós-reset é READY ou PLAYING", true, snapshot?.getState() === ServerState.READY || snapshot?.getState() === ServerState.PLAYING);
	}

	// --- [8] makeGoal (HOME) ---
	console.log("\n🧪 [8] makeGoal (HOME)");
	{
		const before = await controller.getGameSnapshot();
		const homeScoreBefore = before?.getHomeTeam()?.getScore() ?? 0;
		const awayScoreBefore = before?.getAwayTeam()?.getScore() ?? 0;

		const goalPromise = waitForEvent("game:goal");
		await controller.makeGoal(Side.HOME);
		const goalEvent = await goalPromise;

		assert("game:goal emitido", true, goalEvent !== null);
		assert("game:goal lado HOME", Side.HOME, goalEvent?.side);

		const after = await controller.getGameSnapshot();
		assert("placar HOME +1", homeScoreBefore + 1, after?.getHomeTeam()?.getScore());
		assert("placar AWAY inalterado", awayScoreBefore, after?.getAwayTeam()?.getScore());
	}

	// --- [9] makeGoal (AWAY) ---
	console.log("\n🧪 [9] makeGoal (AWAY)");
	{
		const before = await controller.getGameSnapshot();
		const homeScoreBefore = before?.getHomeTeam()?.getScore() ?? 0;
		const awayScoreBefore = before?.getAwayTeam()?.getScore() ?? 0;

		const goalPromise = waitForEvent("game:goal");
		await controller.makeGoal(Side.AWAY);
		const goalEvent = await goalPromise;

		assert("game:goal emitido", true, goalEvent !== null);
		assert("game:goal lado AWAY", Side.AWAY, goalEvent?.side);

		const after = await controller.getGameSnapshot();
		assert("placar HOME inalterado", homeScoreBefore, after?.getHomeTeam()?.getScore());
		assert("placar AWAY +1", awayScoreBefore + 1, after?.getAwayTeam()?.getScore());
	}

	// --- Resultado ---
	console.log(`\n${"─".repeat(40)}`);
	console.log(`Resultado: ${passed} ✅  ${failed} ❌`);
	process.exit(failed > 0 ? 1 : 0);
});

await controller.connect({ auto: false });
