/*
    function updateFacingDirection2(a_stage, is_animated2, character, queue) {
        if (queue.length > 0 && (a_stage === 0 || a_stage === 4)) {
            switch (queue[0]) {
                case 0:
                    if (character.direction === LEFT && character.x_pos > 0 && (WORLD_MAP[character.y_pos][character.x_pos - 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos - 1] === 2)) {
                        is_animated2 = true;
                    } else {
                        // alert("Facing left");
                        a_stage = 0;
                        is_animated2 = false;
                    };
                    break;
                case 1:
                    if (character.direction === RIGHT && character.x_pos < WORLD_WIDTH - 1 && (WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos + 1] === 2)) {
                        is_animated2 = true;
                    } else {
                        // alert("Facing right");
                        a_stage = 0;
                        is_animated2 = false;
                    };
                    break;
                case 2:
                    if (character.direction === UP && character.y_pos > 0 && (WORLD_MAP[character.y_pos - 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos - 1][character.x_pos] === 2)) {
                        is_animated2 = true;
                    } else {
                        // alert("Facing up");
                        a_stage = 0;
                        is_animated2 = false;
                    };
                    break;
                case 3:
                    if (character.direction === DOWN && character.y_pos < WORLD_HEIGHT - 1 && (WORLD_MAP[player.y_pos + 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos + 1][character.x_pos] === 2)) {
                        is_animated2 = true;
                    } else {
                        // alert("Facing down");
                        a_stage = 0;
                        is_animated2 = false;
                    };
                    break;
                default:
                    break;
            };
        };
    }

        function updateFacingDirection3(a_stage, is_animated3, character, queue) {
        if (queue.length > 0 && (a_stage === 0 || a_stage === 4)) {
            switch (queue[0]) {
                case 0:
                    if (character.direction === LEFT && character.x_pos > 0 && (WORLD_MAP[character.y_pos][character.x_pos - 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos - 1] === 2)) {
                        is_animated3 = true;
                    } else {
                        // alert("Facing left");
                        a_stage = 0;
                        is_animated3 = false;
                    };
                    break;
                case 1:
                    if (character.direction === RIGHT && character.x_pos < WORLD_WIDTH - 1 && (WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos + 1] === 2)) {
                        is_animated3 = true;
                    } else {
                        // alert("Facing right");
                        a_stage = 0;
                        is_animated3 = false;
                    };
                    break;
                case 2:
                    if (character.direction === UP && character.y_pos > 0 && (WORLD_MAP[character.y_pos - 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos - 1][character.x_pos] === 2)) {
                        is_animated3 = true;
                    } else {
                        // alert("Facing up");
                        a_stage = 0;
                        is_animated3 = false;
                    };
                    break;
                case 3:
                    if (character.direction === DOWN && character.y_pos < WORLD_HEIGHT - 1 && (WORLD_MAP[player.y_pos + 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos + 1][character.x_pos] === 2)) {
                        is_animated3 = true;
                    } else {
                        // alert("Facing down");
                        a_stage = 0;
                        is_animated3 = false;
                    };
                    break;
                default:
                    break;
            };
        };
    }

        function updateFacingDirection4(a_stage, is_animated4, character, queue) {
        if (queue.length > 0 && (a_stage === 0 || a_stage === 4)) {
            switch (queue[0]) {
                case 0:
                    if (character.direction === LEFT && character.x_pos > 0 && (WORLD_MAP[character.y_pos][character.x_pos - 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos - 1] === 2)) {
                        is_animated4 = true;
                    } else {
                        // alert("Facing left");
                        a_stage = 0;
                        is_animated4 = false;
                    };
                    break;
                case 1:
                    if (character.direction === RIGHT && character.x_pos < WORLD_WIDTH - 1 && (WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos + 1] === 2)) {
                        is_animated4 = true;
                    } else {
                        // alert("Facing right");
                        a_stage = 0;
                        is_animated4 = false;
                    };
                    break;
                case 2:
                    if (character.direction === UP && character.y_pos > 0 && (WORLD_MAP[character.y_pos - 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos - 1][character.x_pos] === 2)) {
                        is_animated4 = true;
                    } else {
                        // alert("Facing up");
                        a_stage = 0;
                        is_animated4 = false;
                    };
                    break;
                case 3:
                    if (character.direction === DOWN && character.y_pos < WORLD_HEIGHT - 1 && (WORLD_MAP[player.y_pos + 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos + 1][character.x_pos] === 2)) {
                        is_animated4 = true;
                    } else {
                        // alert("Facing down");
                        a_stage = 0;
                        is_animated4 = false;
                    };
                    break;
                default:
                    break;
            };
        };
    }
    */
