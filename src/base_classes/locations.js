// ALAN: Set up base location class, with different children classes
import COVID_SMASHER from '../covid_smasher.js'

class Location {
    constructor(x_pos, y_pos) {
        this._x_pos = x_pos;
        this._y_pos = y_pos;
    }
    get x() {
        return this._x_pos;
    }
    get y() {
        return this._y_pos;
    }
};

export class Home extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        if (player._type === "Male Highschool Teen" || player._type === "Male Highschool Teen") {
            player._hp = 100;
            player.delta_morale = 1;
        } else if (player._type === "Male College Student" || player._type === "Female College Student") {
            if (player._hp < 96) {
                player.delta_health = 5;
            }
        } else if (player._type === "Male Impoverished" || player._type === "Female Impoverished") {
            if (player._hp < 96) {
                player.delta_health = 5;
            }
        } else if (player._type === "Male Spoiled Brat" || player._type === "Female Spoiled Brat") {
            player._hp = 110;
            player.delta_morale = 2;
        } else if (player._type === "Male Elderly Person" || player._type === "Female Elderly Person") {
            player.delta_health = 10;
            player.delta_morale = 1;
        }
    }
};

export class Neighbor extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_health = -10;
    }
};

export class Cityhall extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        if (player._type === "Male Elderly Person" || player._type === "Female Elderly Person") {
            player.delta_cash = 10;
            if (Math.random() > 0.6) {
                player.delta_morale = 2;
                return 1;
            } else {
                player.delta_morale = -1;
                return 0;
            };
        } else {
            player.delta_cash = -10;
            player.delta_intelligence = -1;
            player.delta_morale = -1;
            return -1;
        };
    }
};

export class Store extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        ;
    }
};

export class Restaurant extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        ;
    }
};

class DayJob extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
};

export class HighSchool extends DayJob {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_intelligence = 1;
    }
};

export class College extends DayJob {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_intelligence = 2;
        player.delta_cash = -80;
    }
};

export class Work extends DayJob {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_intelligence = 1;
        switch (player.type) {
            case 'HSTeen': case 'PoorPerson':
                player.delta_morale = 1;
                player.delta_cash = 15;
                break;
            case 'RichKid':
                player.delta_morale = -5;
                player.delta_cash = 100;
                break;
            case 'CollegeStudent':
                player.delta_morale = -1;
                break;
            case 'OldMan':
                player.delta_morale = 1;
                break;
            default:
                break;
        }
    }
}

export class Park extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_strength = 1;
        if (player.type === 'RichKid') {
            player.delta_morale = -10;
        }
    }
};

export class Gym extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        player.delta_cash = -10;
        switch (player.type) {
            case 'OldMan':
                player.delta_strength = 1;
                break;
            case 'RichKid': case 'PoorPerson':
                player.delta_strength = 2;
                break;
            case 'HSTeen': case 'CollegeStudent':
                player.delta_strength = 3;
                break;
        }
    }
};

export class Library extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        switch (player.type) {
            case 'RichKid': case 'PoorPerson': case 'OldMan':
                player.delta_intelligence = 1;
                break;
            case 'HSTeen': 
                player.delta_intelligence = 2;
                break;
            case 'CollegeStudent':
                player.delta_intelligence = 3;
                break;
        }
    }
};

export class Hospital extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        if (player.strength === 100 || player.intelligence === 100 || player.morale === 100) {
            alert("You got vaccinated. You win!");
        }
    }
};

export class Casino extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    }
    do_something(player) {
        ;
    }
};

// 40x24 units
export const UNIT_SIZE = 32;
export const WORLD_WIDTH = 40;
export const WORLD_HEIGHT = 24;
export const TOP_BUFFER = 48;
export const DIRECTION = {
    UP: 'Up',
    DOWN: 'Down',
    LEFT: 'Left',
    RIGHT: 'Right'
};
export const WORLD_MAP = 
[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [0,2,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,0,0,0,2,2,2,0,0,2,0,0,0,0,2,0,0,],
    [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,2,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,2,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
    [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
]