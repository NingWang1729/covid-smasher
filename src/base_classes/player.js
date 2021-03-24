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

class Role extends player {
    constructor(x_pos, y_pos, hp, cash, strength, intelligence, morale, type) {
        super(x_pos, y_pos);
        this._hp = hp;
        this._cash = cash;
        this._strength = strength;
        this._intelligence = intelligence;
        this._morale = morale;
        this._type = type;
    }
    get type() {
        return this._type;
    }
    get strength() {
        return this._strength;
    }
    get intelligence() {
        return this._intelligence;
    }
    get morale() {
        return this._morale;
    }
    set delta_health(val) {
        this._hp += val;
    }
    set delta_cash(val) {
        this._cash += val;
    }
    set delta_strength(val) {
        this._strength += val;
    }
    set delta_intelligence(val) {
        this._intelligence += val;
    }
    set delta_morale(val) {
        this._morale += val;
    }
};

class HSTeen extends Role {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos, 100, 100, 40, 45, 50, 'HSTeen');
    }
};

class CollegeStudent extends Role {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos, 100, 200, 50, 69, 50, 'CollegeStudent');
    }
};

class PoorPerson extends Role {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos, 100, 50, 30, 50, 30, 'PoorPerson');
    }
};

class RichKid extends Role {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos, 100, 1000, 20, 60, 60, 'RichKid');
    }
};

class OldMan extends Role {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos, 100, 100, 10, 50, 40, 'OldMan');
    }
};

class Pedestrian extends player {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
}

export { player };