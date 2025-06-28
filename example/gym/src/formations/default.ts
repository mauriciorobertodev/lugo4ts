import { Formation, FormationType, Mapper, Point, Side } from '../../../../src/index.js';

export class DefaultFormation extends Formation {
    constructor() {
        super();
        this.setName('Formação padrão');
        this.setType(FormationType.REGIONS);
        this.setMapper(new Mapper(10, 6, Side.HOME));
        this.setPositionOf(1, new Point(0, 0));
        this.setPositionOf(2, new Point(1, 1));
        this.setPositionOf(3, new Point(2, 2));
        this.setPositionOf(4, new Point(2, 3));
        this.setPositionOf(5, new Point(1, 4));
        this.setPositionOf(6, new Point(3, 1));
        this.setPositionOf(7, new Point(3, 2));
        this.setPositionOf(8, new Point(3, 3));
        this.setPositionOf(9, new Point(3, 4));
        this.setPositionOf(10, new Point(4, 3));
        this.setPositionOf(11, new Point(4, 2));
    }
}
