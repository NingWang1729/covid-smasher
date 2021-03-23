const locations_module = require('./locations.js');

// Player character
class player {
    constructor(x_pos, y_pos) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.direction = locations_module.DIRECTION.DOWN;
        this.img = new Image();
        this.img.src = "images/Cynthia.png"
    };

    get_x_pos() {
        return this.x_pos;
    };

    get_y_pos() {
        return this.y_pos;
    };

    get_directon() {
        return this.direction;
    };

    set_direction(new_direction) {
        this.direction = new_direction;
    };

    move_right() {
        if (this.x_pos < locations_module.WORLD_WIDTH - 1 && locations_module.WORLD_MAP[this.y_pos][this.x_pos + 1] === 0) {
            this.x_pos += 1;
        };
    };
    move_left() {
        if (this.x_pos > 0 && locations_module.WORLD_MAP[this.y_pos][this.x_pos - 1] === 0) {
            this.x_pos -= 1;
        };
    };

    move_up() {
        if (this.y_pos > 0 && locations_module.WORLD_MAP[this.y_pos - 1][this.x_pos] === 0) {
            this.y_pos -= 1;
        };
    };

    move_down() {
        if (this.y_pos < locations_module.WORLD_HEIGHT - 1 && locations_module.WORLD_MAP[this.y_pos + 1][this.x_pos] === 0) {
            this.y_pos += 1;
        }
    };
};

module.exports = {player};