import swal from '@sweetalert/with-react'

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
        this._item_type = "NONE";
    }
    use_effect(player) {
        // player.delta_cash = -this._cost;
    }
};

export class Plastic_Meat extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Plastic_Meat";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 5;
        player.delta_morale = -1;
    }
};

export class Plastic_Water extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Plastic_Water";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 5;
        player.delta_intelligence = -1;
    }
};

export class Fidget_Spinner extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Fidget_Spinner";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_morale = 1;
    }
};

export class Cooked_Chicken extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Cooked_Chicken";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 10;
        player.delta_morale = 1;
    }
};

export class Cooked_Bistec extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Cooked_Bistec";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 20;
        player.delta_intelligence = 2;
    }
};

export class Lawn_Mower extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Lawn_Mower";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_morale = -10;
        player.delta_intelligence = -10;
        player.delta_health = -10;
        player.delta_strength = 5;
    }
};

export class Pizza extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Pizza";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 15;
        player.delta_morale = 3;
    }
};

export class Lemon extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Lemon";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 1;
        player.delta_intelligence = 1;
        player.delta_morale = 1;
        player.delta_strength = 1;
        player.delta_health = 1;
    }
};

export class Shell_Script extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Shell_Script";
    }
    use_effect(player) {
        super.use_effect(player);
        player.x_pos = 2;
        player.y_pos = 5;
        player.delta_health = 100;
        player._substenance = 100;
    }
};

export class Hard_To_Swallow_Pills extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Hard_To_Swallow_Pills";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("Whoops!","You could not swallow these pills! You lost 50% of your current hp.", "error");
        player.delta_health = -Math.floor(player.health / 2);
    }
};

export class Vim extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Vim";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("Whoops!", "Vim is built in. Why did you buy this?", "error");
        player.delta_intelligence = -10;
        player.delta_morale = -10;
        player.delta_strength = -10;
    }
};

export class Emacs extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Emacs";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("Timezones!", "Eggert was here. GNU is open source.", "info").then(()=>{
            swal(<p>GNU is an operating system that is <a href="https://www.gnu.org/" target="_blank">free software</a>—that is, it respects users' freedom.</p>)
        });
        player.delta_health = -50;
        player.delta_intelligence = 10;
    }
};

export class Wurd extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Wurd";
    }
    use_effect(player) {
        swal("Segfault!", "Smolberg knows all.", "error");
        player.delta_intelligence = 10;
        player.delta_cash = Math.floor(player.cash / 2); // equivalent to bitshift right
    }
};

export class Borger extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Borger";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 20;
        player.delta_morale = 2;
    }
};

export class Header_Fries extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Header_Fries";
    }
    use_effect(player) {
        player.delta_substenance = 10;
        player.delta_morale = 1;
    }
};

export class Soda extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Soda";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_substenance = 5;
        player.delta_morale = 1;
    }
};

export class Butterbeer extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Butterbeer";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_health = 5;
        player.delta_morale = 1;
    }
};

export class Dry_Martini extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Dry_Martini";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_health = -10;
        player.delta_intelligence = 1;
        player.delta_strength = 1;
        player.delta_morale = 1;
    }
};

export class Spam_and_eggs extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Spam_and_eggs";
    }
    use_effect(player) {
        super.use_effect(player);
        player.delta_health = 5;
        player._substenance = 10;
        player.delta_intelligence = 1;
        player.delta_morale = 1;
    }
};

export class Bread_Stacks extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Bread_Stacks";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("These are unlimited until stack overflows.");
        player.delta_health = 5;
        player.delta_substenance = 10;
        player.delta_morale = 1;
    }
};

export class Copypasta extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Copypasta";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("Mmm. Fresh pasta.");
        player.delta_morale = 2;
        player.delta_health = 10;
        player.delta_substenance = 30;
        player.delta_strength = 1;
    }
}

export class Tiramisu extends Item {
    constructor(store_type) {
        super(store_type);
        this._item_type = "Tiramisu";
    }
    use_effect(player) {
        super.use_effect(player);
        swal("Mmm. Chocolate Mousse.");
        player.delta_health = 10;
        player.delta_substenance = 10;
        player.delta_morale = 1;
        player.delta_intelligence = 1;
    }
}