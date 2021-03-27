import { WORLD_WIDTH, WORLD_HEIGHT, WORLD_MAP, DIRECTION } from './locations.js';
import * as items_module from './items.js';

const INVENTORY_ROWS = 3;
const INVENTORY_COLS = 5;
const INVENTORY_LENGTH = INVENTORY_ROWS * INVENTORY_COLS;

class Inventory {
    constructor(capacity) {
        this._item_array = [];
        this._capacity = capacity;
    }
    add_item(item) {
        // Inventory reached max capacity; cannot add more
        if (this._item_array.length >= this._capacity) return false

        // Add item to array
        this._item_array.push(item)
        return true
    }
    use_item(index, player) {
        player._inventory._item_array[index].use_effect(player);

        for (let i = index+1; i < player._inventory._item_array.length; ++i) {
            player._inventory._item_array[i - 1] = player._inventory._item_array[i];
        }
        player._inventory._item_array.pop();

        // TO-DO: Refactor to use splice() instead
        // Delete 1 item at the index
        // player._inventory._item_array.splice(index, 1);
    }
    convert_2D_array(nRows, nCols) {
        let item_2D_array = [];
        let k = this._item_array.length;
        for (let i = 0; i < nRows && k != 0; ++i) {
            item_2D_array.push([]);
            for (let j = 0; j < nCols && k != 0; ++j) {
                item_2D_array[i].push(this._item_array[this._item_array.length - k]);
            }
        }
        return item_2D_array;
    }
};

// Player character
class Player {
    constructor(x_pos, y_pos) {
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.direction = DIRECTION.DOWN;
        this.img = new Image();
        this.img.src = "images/sprite_sheets/Cynthia.png"
        this._inventory = new Inventory(INVENTORY_LENGTH);
    };

    // Add/use item at a given index
    add_item(item) { return this._inventory.add_item(item); };
    use_item(index) { this._inventory.use_item(index, this); }

    // Getters for getting position, direction
    get_x_pos() { return this.x_pos; };
    get_y_pos() { return this.y_pos; };
    get_directon() { return this.direction; };
    set_direction(newDirection) { this.direction = newDirection; };

    canMoveHere(x, y) {
        // Out of bounds on the x-axis
        if (x <= 0 || x >= WORLD_WIDTH - 1) return false

        // Out of bounds on the y-axis
        if (y <= 0 || y >= WORLD_HEIGHT - 1) return false

        // Check if player can move here on the map
        // TO-DO: Why is locations_module [y][x] and not [x][y] wtf
        const locationValue = WORLD_MAP[y][x]

        // Return true if it matches a valid location value
        if (locationValue === 0 || locationValue === 2) return true
        else return false
    }

    move_right() { if (this.canMoveHere(this.x_pos + 1, this.y_pos)) this.x_pos += 1; };
    move_left() { if (this.canMoveHere(this.x_pos - 1, this.y_pos)) this.x_pos -= 1 };
    move_up() { if (this.canMoveHere(this.x_pos, this.y_pos - 1)) this.y_pos -= 1};
    move_down() { if (this.canMoveHere(this.x_pos, this.y_pos + 1)) this.y_pos += 1 };
};

class Role extends Player {
    constructor(x_pos, y_pos, hp, cash, strength, intelligence, morale, type) {
        super(x_pos, y_pos);
        this._hp = hp;
        this._cash = cash;
        this._strength = strength;
        this._intelligence = intelligence;
        this._morale = morale;
        this._type = type;
        this._substenance = 100;
        this._slot = 1;
    }
    // Getters to get all sorts of info about the player
    get type() { return this._type; }
    get health() { return this._hp; }
    get hp() { return this._hp; }
    get cash() { return this._cash; }
    get strength() { return this._strength; }
    get intelligence() { return this._intelligence; }
    get morale() { return this._morale; }
    get substenance() { return this._substenance; }

    // Add/decrement values by a certain amount
    set delta_health(val) { this._hp += val; }
    set delta_cash(val) { this._cash += val; }
    set delta_strength(val) { this._strength += val; }
    set delta_intelligence(val) { this._intelligence += val; }
    set delta_morale(val) { this._morale += val; }
    set delta_substenance(val) { this._substenance += val; }

    // Get all the stats of the player
    // Need this to save to database
    playerState() { 
        return {
          slot: this._slot,
          position: {
            x: this.x_pos,
            y: this.y_pos,
          },
          playerType: this._type,
          direction: this.direction,
          stats: {
            intelligence: this._intelligence,
            strength: this._strength,
            morale: this._morale,
            sustenance: this._substenance, // TO-DO: Change substenance to sustenance
            health: this._hp,
          },
          money: this._cash,
          inventory: this._inventory,
        }
    }
};

// TO-DO: All of this here is unused code, remove it?
/*
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
*/

export { Player, Role };