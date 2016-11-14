class Player {
    constructor(map) {
        this.position = [40, 40];
        this.map = map;
    }

    move(movement) {
        this.position = this.map.checkMove(this.position, movement, 3);
    }
}
