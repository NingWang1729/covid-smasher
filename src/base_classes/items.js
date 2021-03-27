class Item {
    constructor(store_type) { // store_type = unary, binary, ternary
        switch (store_type) {
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
        super(use_effect(player));
        player.delta_morale = 1;
    }
};

class Pill extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super(use_effect(player));
        alert("You could not swallow these pills! You lost 50% of your current hp.");
        player.delta_health = -Math.floor(player.health / 2);
    }
};

class Vim extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super(use_effect(player));
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
        super(use_effect(player));
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

class Borger extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super(use_effect(player));
        alert("This borger sure was good.");
        player.delta_health = 5;
    }
};

class HeaderFries extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super(use_effect(player));
        alert("These were pretty ok.");
        player.delta_health = 2;
    }
};

class Alcohol extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("Are you sure you should be drinking this?");
        player.delta_health = -10;
        player.delta_intelligence = -5;
        player.delta_morale = 5;
    }
};

class BreadStacks extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("These are unlimited until stack overflow.");
        player.delta_health = 5;
    }
};

class Copypasta extends Item {
    constructor(store_type) {
        super(store_type);
    }
    use_effect(player) {
        super.use_effect(player);
        alert("Mmm. Fresh pasta.");
        player.delta_morale = 10;
    }
}