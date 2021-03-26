class Item {
    constructor(store_type) { // store_type = unary, binary, ternary
        switch (store_type) { // Will prob change up....
            case "unary":
                this._cost = 1;
                break;
            case "binary":
                this._cost = 2;
                break;
            case "ternary":
                this._cost = 3;
                break;
            default:
                break;
        }
    }
    use_effect(player) {
        player.delta_cash = -this._cost;
    }
};

class Sustenance extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_morale = -1;
    }
};

class FidgetSpinner extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_morale = 1;
    }
};

class Pill extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("You could not swallow these pills! You lost 50% of your current hp.");
        player.delta_health = -Math.floor(player.health / 2);
    }
};

class Vim extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("Vim is built in. Why did you buy this?");
        player.delta_intelligence = -1;
        player.delta_morale = -10;
    }
};

class Emacs extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("Eggert was here. GNU is open source.");
        player.delta_health = -10;
        player.delta_intelligence = -1;
    }
};

class Wurd extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        alert("Smallberg knows all!");
        player.delta_intelligence = -1;
        player.delta_cash = Math.floor(player.cash / 2); // equivalent to bitshift right
    }
};