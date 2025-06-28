import { GymSession, IGymSession, IGymTrainer } from '@/gym.js';
import * as tf from '@tensorflow/tfjs-node';
import * as fs from 'fs';

import { Order } from '@/generated/server.js';

import { IGameInspector, SPECS } from '@/core.js';

// ──────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────
type State = [number, number, number, number, number, number, number];
type Action = GKAction;

// três ações discretas
enum GKAction {
    TOP = 0,
    CENTER = 1,
    BOTTOM = 2,
}

// Replay memory item
interface Exp {
    s: State;
    a: GKAction;
    r: number;
    s1: State;
    done: boolean;
}

// ──────────────────────────────────────────────────────────────
// Trainer
// ──────────────────────────────────────────────────────────────
export class RLGoalkeeperTrainer implements IGymTrainer<State, Action> {
    // TensorFlow
    private model!: tf.LayersModel;
    private target!: tf.LayersModel;
    private memory: Exp[] = [];
    private ε = 1.0; // exploração inicial
    private readonly εMin = 0.05;
    private readonly εDecay = 0.995;
    private readonly γ = 0.95; // discount

    private readonly MODEL_DIR = './models/gk-catcher';
    private readonly TARGET_DIR = './models/gk-catcher-target';

    constructor() {}

    /** Deve ser chamado uma vez antes de treinar ou prever */
    async init() {
        if (fs.existsSync(this.MODEL_DIR + '/model.json')) {
            this.model = await tf.loadLayersModel('file://' + this.MODEL_DIR + '/model.json');
            this.target = await tf.loadLayersModel('file://' + this.TARGET_DIR + '/model.json');
            console.log('Modelos carregados do disco.');

            // precisa recompilar!
            this.model.compile({ optimizer: tf.train.adam(1e-3), loss: 'meanSquaredError' });
        } else {
            this.model = this.buildModel(); // buildModel já compila
            this.target = this.buildModel();
            console.log('Modelos novos criados.');
        }

        this.syncTarget();
        // dry‑predict para criar variáveis
        const dummy = tf.zeros([1, 7]);
        this.model.predict(dummy);
        this.target.predict(dummy);
        dummy.dispose();
    }

    // ───────── helpers ─────────
    private buildModel() {
        const m = tf.sequential();
        m.add(tf.layers.dense({ inputShape: [7], units: 32, activation: 'relu' }));
        m.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        m.add(tf.layers.dense({ units: 3 })); // Q‑value para cada ação
        m.compile({ optimizer: tf.train.adam(1e-3), loss: 'meanSquaredError' });
        return m;
    }

    private syncTarget() {
        this.target.setWeights(this.model.getWeights());
    }

    // ───────── RL interface ─────────
    async state(g: IGameInspector): Promise<State> {
        return [
            g.getMe().getPosition().getX() / SPECS.MAX_X_COORDINATE,
            g.getMe().getPosition().getY() / SPECS.MAX_Y_COORDINATE,
            g.getBallPosition().getX() / SPECS.MAX_X_COORDINATE,
            g.getBallPosition().getY() / SPECS.MAX_Y_COORDINATE,
            g.getBallDirection().getX(),
            g.getBallDirection().getY(),
            g.getBallSpeed() / SPECS.BALL_MAX_SPEED,
        ];
    }

    async action(state: State): Promise<Action> {
        // ε‑greedy
        if (Math.random() < this.ε) {
            return Math.floor(Math.random() * 3) as GKAction;
        }
        const q = this.model.predict(tf.tensor2d([state])) as tf.Tensor;
        const a = (await q.argMax(1).data())[0] as GKAction;
        // console.log(`[DQN] Ação predita: ${a} (ε=${this.ε.toFixed(2)})`);
        q.dispose();
        return a;
    }

    async play(act: GKAction, g: IGameInspector): Promise<Order[]> {
        const orders: (Order | null)[] = [];
        const goal = g.getDefenseGoal();

        switch (act) {
            case GKAction.TOP:
                orders.push(g.tryMakeOrderMoveToPoint(goal.getTopPole()));
                break;
            case GKAction.CENTER:
                orders.push(g.tryMakeOrderMoveToPoint(goal.getCenter()));
                break;
            case GKAction.BOTTOM:
                orders.push(g.tryMakeOrderMoveToPoint(goal.getBottomPole()));
                break;
        }

        orders.push(g.makeOrderCatch()); // tenta pegar a bola
        return orders.filter(Boolean) as Order[];
    }

    async evaluate(prev: IGameInspector, curr: IGameInspector): Promise<{ reward: number; done: boolean }> {
        // ──────────────────────────────────────────────────────────
        // 1. Recompensa máxima: pegou a bola
        // ──────────────────────────────────────────────────────────
        const holder = curr.getBallHolder();
        if (holder && holder.is(curr.getMe())) {
            // Pegou => termina o episódio com grande recompensa
            return { reward: 1.0, done: true };
        }

        // ──────────────────────────────────────────────────────────
        // 2. Penalidade por tomar gol
        // ──────────────────────────────────────────────────────────
        const prevScore = prev.getOpponentTeam().getScore();
        const currScore = curr.getOpponentTeam().getScore();
        if (prevScore < currScore) {
            // Tomou gol => termina o episódio com grande penalidade
            return { reward: -1.0, done: true };
        }

        // ──────────────────────────────────────────────────────────
        // 3. Distância atual e anterior até a bola
        // ──────────────────────────────────────────────────────────
        const dPrev = prev.getMe().distanceToPoint(prev.getBallPosition()); // distância no turno anterior
        const dCurr = curr.getMe().distanceToPoint(curr.getBallPosition()); // distância agora

        // Normaliza a distância (0 = no mesmo ponto, 1 ≈ muito longe do campo)
        // Supondo campo ~ 22 000 × 11 000, o máximo esperado de distância ~ 25 000
        const MAX_DIST = 25_000;
        const distNorm = Math.min(dCurr / MAX_DIST, 1);

        // ──────────────────────────────────────────────────────────
        // 4. Recompensa de proximidade (valor absoluto)
        //    Quanto mais perto, maior (entre 0 e +0.5)
        // ──────────────────────────────────────────────────────────
        const rProximity = 0.5 * (1 - distNorm); // 0‑0.5

        // ──────────────────────────────────────────────────────────
        // 5. Recompensa de aproximação (delta)
        //    Se aproximou => positivo, se afastou => negativo
        //    Normaliza o delta em relação ao campo (±0.25 máx)
        // ──────────────────────────────────────────────────────────
        const delta = (dPrev - dCurr) / MAX_DIST; // aproximação em fração
        const rApproach = 0.25 * delta; // ±0.25

        // ──────────────────────────────────────────────────────────
        // 6. Recompensa de posicionamento “safe”
        //    Se a bola está longe (> 8 000) e o goleiro está perto
        //    do centro do gol (±200) => pequeno bônus
        // ──────────────────────────────────────────────────────────
        const DIST_FAR = 8_000;
        const CENTER_RADIUS = 200;
        const ballFar = dCurr > DIST_FAR;
        const nearCenter = curr.getMe().distanceToPoint(curr.getDefenseGoal().getCenter()) < CENTER_RADIUS;

        const rSafety = ballFar && nearCenter ? 0.25 : 0; // 0 ou +0.25

        // ──────────────────────────────────────────────────────────
        // 7. Soma ponderada das partes
        // ──────────────────────────────────────────────────────────
        const reward = rProximity + rApproach + rSafety; // máx ~ 1, mín ~ -0.25

        return { reward, done: false };
    }

    async train(session: IGymSession): Promise<void> {
        const BATCH = 64;
        let step = 0;

        const GAMES = 1000; // número de jogos para treinar
        console.log(`[DQN] Treinando goleiro por ${GAMES} jogos...`);
        const MAX_TURNS = 100; // número máximo de turnos por jogo

        for (let game = 1; game <= GAMES; game++) {
            for (let turn = 1; turn <= MAX_TURNS; turn++) {
                const { input: s, output: a, reward: r, done } = await session.update();
                // `session.update()` já moveu o jogo: o snapshot atual mudou,
                // logo o input guardado dentro da sessão já é o s1
                const s1 = await this.state(session.getLastSnapshot());

                // grava memória
                this.memory.push({ s: s as State, a: a as GKAction, r, s1, done });

                // aprende
                if (this.memory.length >= BATCH) await this.learn(BATCH);

                // decai ε e sincroniza rede‑alvo às vezes
                if (++step % 1000 === 0) this.syncTarget();
                if (this.ε > this.εMin) this.ε *= this.εDecay;

                if (done) break; // fim do jogo
            }

            await session.reset();
            await this.saveModels();
        }

        await session.stop();
        await this.saveModels(); // salva pesos finais
    }

    private async learn(batchSize: number) {
        const sample = this.memory.sort(() => 0.5 - Math.random()).slice(0, batchSize);

        // monta tensores
        const states = tf.tensor2d(sample.map((e) => e.s));
        const nextSt = tf.tensor2d(sample.map((e) => e.s1));
        const qNext = this.target.predict(nextSt) as tf.Tensor;
        const maxQNxt = (await qNext.max(1).array()) as number[];

        const targetQ = this.model.predict(states) as tf.Tensor;
        const targetArr = (await targetQ.array()) as number[][];

        sample.forEach((e, i) => {
            targetArr[i][e.a] = e.r + (e.done ? 0 : this.γ * maxQNxt[i]);
        });

        const y = tf.tensor2d(targetArr);
        await this.model.fit(states, y, { epochs: 1, verbose: 0 });

        states.dispose();
        nextSt.dispose();
        qNext.dispose();
        targetQ.dispose();
        y.dispose();
    }

    private async saveModels() {
        // cria pastas se ainda não existem
        if (!fs.existsSync(this.MODEL_DIR)) fs.mkdirSync(this.MODEL_DIR, { recursive: true });
        if (!fs.existsSync(this.TARGET_DIR)) fs.mkdirSync(this.TARGET_DIR, { recursive: true });

        await this.model.save('file://' + this.MODEL_DIR);
        await this.target.save('file://' + this.TARGET_DIR);
        console.log('[DQN] Modelos salvos em disco.');
    }
}
