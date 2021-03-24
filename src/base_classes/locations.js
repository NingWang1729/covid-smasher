// ALAN: Set up base location class, with different children classes
import COVID_SMASHER from '../covid_smasher.js'

class Location {
    constructor(x_pos, y_pos, player) {
        this._x_pos = x_pos;
        this._y_pos = y_pos;
        this._player = player;
    }
};

class Home extends Location {

};

class Store extends Location {

};

class Restaurant extends Location {

};

class DayJob extends Location {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
};

class HighSchool extends DayJob {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        this._player.delta_intelligence = 1;
    }
};

class College extends DayJob {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        this._player.delta_intelligence = 2;
        this._player.delta_cash = -80;
    }
};

class Work extends DayJob {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        this._player.delta_intelligence = 1;
        switch (this._player.type) {
            case 'HSTeen': case 'PoorPerson':
                this._player.delta_morale = 1;
                this._player.delta_cash = 15;
                break;
            case 'RichKid':
                this._player.delta_morale = -5;
                this._player.delta_cash = 100;
                break;
            case 'CollegeStudent':
                this._player.delta_morale = -1;
                break;
            case 'OldMan':
                this._player.delta_morale = 1;
                break;
            default:
                break;
        }
    }
}

class Park extends Location {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        this._player.delta_strength = 1;
        if (this._player.type === 'RichKid') {
            this._player.delta_morale = -10;
        }
    }
};

class Gym extends Location {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        this._player.delta_cash = -10;
        switch (this._player.type) {
            case 'OldMan':
                this._player.delta_strength = 1;
                break;
            case 'RichKid': case 'PoorPerson':
                this._player.delta_strength = 2;
                break;
            case 'HSTeen': case 'CollegeStudent':
                this._player.delta_strength = 3;
                break;
        }
    }
};

class Library extends Location {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        switch (this._player.type) {
            case 'RichKid': case 'PoorPerson': case 'OldMan':
                this._player.delta_intelligence = 1;
                break;
            case 'HSTeen': 
                this._player.delta_intelligence = 2;
                break;
            case 'CollegeStudent':
                this._player.delta_intelligence = 3;
                break;
        }
    }
};

class Hospital extends Location {
    constructor(x_pos, y_pos, player) {
        super(x_pos, y_pos, player);
    }
    do_something() {
        if (this._player.strength === 100 || this._player.intelligence === 100 || this._player.morale === 100) {
            // Win? IDK how to end a game
        }
    }
};

class Casino extends Location {

};

// 40x24 units
const UNIT_SIZE = 32;
const WORLD_WIDTH = 40;
const WORLD_HEIGHT = 24;
const TOP_BUFFER = 48;
const DIRECTION = {
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right'
};
const WORLD_MAP = 
[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [0,2,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
]

export { UNIT_SIZE, WORLD_WIDTH, WORLD_HEIGHT, TOP_BUFFER, DIRECTION, WORLD_MAP };