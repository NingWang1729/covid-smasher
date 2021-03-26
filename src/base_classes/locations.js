// ALAN: Set up base location class, with different children classes
import COVID_SMASHER from '../covid_smasher.js'

class Location {
    constructor(x_pos, y_pos) {
        this._x_pos = x_pos;
        this._y_pos = y_pos;
    };
    get x() {
        return this._x_pos;
    };
    get y() {
        return this._y_pos;
    };
};

export class Home extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player._type === "Male Highschool Teen" || player._type === "Female Highschool Teen") {
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
        };
    };
};

export class Neighbor extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        player.delta_health = -10;
    };
};

export class Cityhall extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
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
    };
};

export class Store extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        let selection = prompt("1: Food, 2: Drink, 3: Spinner", "1");
        switch (parseInt(selection)) {
            case 1:
                player.delta_morale = -1;
                break;
            case 2:
                player.delta_morale = 1;
                break;
            case 3:
                player.delta_morale = 1;
                alert("Whee!");
                break;
        };
    };
};

export class Restaurant extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        ;
    };
};

export class HighSchool extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player._type === "Male Highschool Teen" || player._type === "Female Highschool Teen") {
            if (Math.random() > 0.6) {
                player.delta_intelligence = 1;
                return 1;
            } else {
                player.delta_intelligence = -2;
                return 0;
            }
        } else {
            player.delta_morale = -1;
            return -1;
        };
    };
};

export class College extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player._type === "Male College Student" || player._type === "Female College Student") {
            player.delta_intelligence = 2;
            player.delta_cash = -50;
            return 0;
        } else {
            if (player._cash < 10) {
                player.delta_morale = -1;
                return 1;
            }
            player.delta_morale = 1;
            player.delta_cash = -10;
            return 2;
        };
    };
};

export class Work extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player._type === "Male Highschool Teen" || player._type === "Female Highschool Teen") {
            player.delta_cash = 15;
            return 0;
        } else if (player._type === "Male College Student" || player._type === "Female College Student") {
            if (player._intelligence >= 85) {
                player.delta_cash = player._intelligence - 60;
                player.delta_intelligence = 5;
                return 2;
            } else if (player._intelligence >= 75) {
                player.delta_intelligence = 2;
                return 1;
            } else {
                player.delta_cash = 15;
                return 0;
            }
        } else if (player._type === "Male Impoverished" || player._type === "Female Impoverished") {
            if (player._intelligence >= 60) {
                player.delta_cash = 15;
                return 0;
            } else {
                player.delta_morale = -2;
                return 3;
            }
        } else if (player._type === "Male Spoiled Brat" || player._type === "Female Spoiled Brat") {
            player.delta_cash = 100;
            return 4;
        } else if (player._type === "Male Elderly Person" || player._type === "Female Elderly Person") {
            if (Math.random() > 0.8) {
                player.delta_morale = 1;
            }
            return 5;
        };
    };
};

export class Park extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        player.delta_strength = 1;
        if (player.type === 'RichKid') {
            player.delta_morale = -10;
        };
    };
};

export class Gym extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player._cash < 10) {
            player.delta_morale = -10;
            return false;
        };
        player.delta_cash = -10;
        switch (player.type) {
            case "Male College Student":
            case "Female College Student":
            case "Male Highschool Teen":
            case "Female Highschool Teen":
                if (Math.random() > 0.9) {
                    player.delta_strength = 3;
                } else if (Math.random() > 0.8) {
                    player.delta_strength = 2;
                } else {
                    player.delta_strength = 1;
                }
                break;
            case "Male Spoiled Brat":
            case "Female Spoiled Brat":
            case "Male Impoverished":
            case "Female Impoverished":
                if (Math.random() > 0.8) {
                    player.delta_strength = 2;
                } else {
                    player.delta_strength = 1;
                }
                break;
            default:
                player.delta_strength = 1;
                break;
        };
        return true;
    };
};

export class Library extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        switch (player.type) {
            case "Male College Student":
            case "Female College Student":
                if (Math.random() > 0.9) {
                    player.delta_intelligence = 3;
                } else if (Math.random() > 0.8) {
                    player.delta_intelligence = 2;
                } else {
                    player.delta_intelligence = 1;
                }
                break;
            case "Male Highschool Teen":
            case "Female Highschool Teen":
                if (Math.random() > 0.8) {
                    player.delta_intelligence = 2;
                } else {
                    player.delta_intelligence = 1;
                }
                break;
            default:
                player.delta_intelligence = 1;
                break;
        };
    };
};

export class Hospital extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        if (player.strength >= 100 || player.intelligence >= 100 || player.morale >= 100) {
            return true;
        };
    };
};

export class Casino extends Location {
    constructor(x_pos, y_pos) {
        super(x_pos, y_pos);
    };
    do_something(player) {
        ;
    };
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