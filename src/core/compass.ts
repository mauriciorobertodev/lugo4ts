import { Vector2D } from '@/core/vector.js';

export class Compass {
    /** 0° */
    static readonly N = Compass.vectorFromDeg(0);
    /** 15° */
    static readonly NbE = Compass.vectorFromDeg(15);
    /** 30° */
    static readonly NNE = Compass.vectorFromDeg(30);
    /** 45° */
    static readonly NE = Compass.vectorFromDeg(45);
    /** 60° */
    static readonly NEbE = Compass.vectorFromDeg(60);
    /** 75° */
    static readonly ENE = Compass.vectorFromDeg(75);
    /** 90° */
    static readonly E = Compass.vectorFromDeg(90);
    /** 105° */
    static readonly EbS = Compass.vectorFromDeg(105);
    /** 120° */
    static readonly ESE = Compass.vectorFromDeg(120);
    /** 135° */
    static readonly SE = Compass.vectorFromDeg(135);
    /** 150° */
    static readonly SEbS = Compass.vectorFromDeg(150);
    /** 165° */
    static readonly SSE = Compass.vectorFromDeg(165);
    /** 180° */
    static readonly S = Compass.vectorFromDeg(180);
    /** 195° */
    static readonly SbW = Compass.vectorFromDeg(195);
    /** 210° */
    static readonly SSW = Compass.vectorFromDeg(210);
    /** 225° */
    static readonly SW = Compass.vectorFromDeg(225);
    /** 240° */
    static readonly SWbW = Compass.vectorFromDeg(240);
    /** 255° */
    static readonly WSW = Compass.vectorFromDeg(255);
    /** 270° */
    static readonly W = Compass.vectorFromDeg(270);
    /** 285° */
    static readonly WbN = Compass.vectorFromDeg(285);
    /** 300° */
    static readonly WNW = Compass.vectorFromDeg(300);
    /** 315° */
    static readonly NW = Compass.vectorFromDeg(315);
    /** 330° */
    static readonly NWbN = Compass.vectorFromDeg(330);
    /** 345° */
    static readonly NbW = Compass.vectorFromDeg(345);

    static randomDirection(): Vector2D {
        const randomDeg = Math.floor(Math.random() * 360);
        return Compass.vectorFromDeg(randomDeg);
    }

    private static vectorFromDeg(deg: number): Vector2D {
        const rad = (deg * Math.PI) / 180;
        return new Vector2D(Math.sin(rad), -Math.cos(rad)); // 0° é "para cima" (norte)
    }
}
