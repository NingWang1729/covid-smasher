// Original code for reference
/*
const deepCopy = (arr) => {
  let copy = [];
  arr.forEach(elem => {
    if (Array.isArray(elem)) copy.push(deepCopy(elem))
    else if (typeof elem === 'object') copy.push(deepCopyObject(elem))
    else copy.push(elem)
  })
  return copy;
}
*/


// const deepCopyObject = (orig) => {
// Original code for reference, TO-DO: Remove it if it works
//   let tempObj = {};
//   for (let [key, value] of Object.entries(obj)) {
//     if (Array.isArray(value)) {
//       tempObj[key] = deepCopy(value);
//     } else {
//       if (typeof value === 'object') {
//         tempObj[key] = deepCopyObject(value);
//       } else {
//         tempObj[key] = value
//       }
//     }
//   }
//   return tempObj;
// }

// TO-DO: Unused variables, we can remove these
// var bfs_map1 = deepCopy(WORLD_MAP);
// var bfs_map2 = deepCopy(WORLD_MAP);

// Sometimes this does not work
// function getRandomValidPosition() {
//     for (;;) {
//         // 4 is for the buffer
//         const randRow = getRandomNumber(0, WORLD_HEIGHT - 1)
//         const randCol = getRandomNumber(0, WORLD_WIDTH - 1)
        
//         // If the start position is valid
//         if (WORLD_MAP[randRow][randCol] === 0) {
//             console.log("Map Locale", WORLD_MAP[randRow][randCol]);
//             console.log(randRow, randCol);

//             return [randRow, randCol];
//         }
//     }
// }

// BFS Implementation
// function exploreNeighbors(r, c, rq, cq, visited, moveInput, grid) {
//     // NSEW Change Coordinates
//     const dr = [-1, 1, 0, 0];
//     const dc = [0, 0, 1, -1];
//     for (let i = 0; i < 4; i++) {
//         let rr = r + dr[i];
//         let cc = c + dc[i];

//         if (!canMove(rr, cc, grid)) {
//             continue;
//         }

//         // Adding unvisited Nodes to visited
//         rq.unshift(rr);
//         cq.unshift(cc);
//         visited.push([rr,cc]);
//         grid[rr][cc] = 1;

//         // Pushing movement input
//         if (i === 0) moveInput.push(2);
//         else if (i === 1) moveInput.push(3);
//         else if (i === 2) moveInput.push(0);
//         else if (i === 3) moveInput.push(1);     
//     }
// }

// function bfs(row, col, grid) {
//     var rq = [row];
//     var cq = [col];
//     var visited = [[row, col]]
//     var move_input = []
//     grid[row][col] = 1;
    
//     while (rq.length > 0) {
//         let r = rq.shift();
//         let c = cq.shift();

//         if (grid[r][c] === 4) {
//             return;
//         }

//         exploreNeighbors(r, c, rq, cq, visited, move_input, grid);
//         // console.log(rq, cq);
//         // console.log(visited);
//         // console.dir(visited, {'maxArrayLength': null});
//     }

//     return move_input
// }


// Unused function
/*
function randomMovement(character) {
    let move_arr = [];
    // let curr_row = character.get_y_pos;
    // let curr_col = character.get_x_pos;

    for (let i = 0; i < 101; i++) {
        let direction_int = getRandomNumber(0,3);
        let append_count = getRandomNumber(1,10);
        for (let j = 0; j < append_count; j++) {
            // if (direction_int === 0) {
            //     if (WORLD_MAP[curr_row][curr_col - 1] != 0) {
            //         continue;
            //     }
            //     curr_col -= 1;
            // } else if (direction_int === 1) {
            //     if (WORLD_MAP[curr_row][curr_col + 1] != 0) {
            //         continue;
            //     }
            //     curr_col += 1;
            // } else if (direction_int === 2) {
            //     if (WORLD_MAP[curr_row - 1][curr_col] != 0) {
            //         continue;
            //     }
            //     curr_row -= 1;
            // } else if (direction_int === 3) {
            //     if (WORLD_MAP[curr_row + 1][curr_col] != 0) {
            //         continue;
            //     }
            //     curr_row += 1;
            // }
            
            move_arr.push(direction_int)
        }    
    }

    return move_arr;
}
*/

// var move_directions = deepCopy(move_directions);
// var move_directions2 = deepCopy(move_directions);
// var move_directions3 = deepCopy(move_directions);
// var move_directions4 = deepCopy(move_directions);

// BFS Algo
// let bfs_move_que = fixNPCMoveQueue(bfs(rows,cols, bfs_map1));
// move_directions = bfs_move_que;

    // for (let i = 0; i < player._inventory._item_array.length; i++) {
    //     if (player._inventory._item_array[i]._item_type === "Plastic_Meat") {
    //         player._inventory._item_array[i] = new items_module.Plastic_Meat;
    //     } else if (player._inventory._item_array[i]._item_type === "Plastic_Water") {
    //         player._inventory._item_array[i] = new items_module.Plastic_Water;
    //     } else if (player._inventory._item_array[i]._item_type === "Fidget_Spinner") {
    //         player._inventory._item_array[i] = new items_module.Fidget_Spinner;
    //     } else if (player._inventory._item_array[i]._item_type === "Cooked_Chicken") {
    //         player._inventory._item_array[i] = new items_module.Cooked_Chicken;
    //     } else if (player._inventory._item_array[i]._item_type === "Cooked_Bistec") {
    //         player._inventory._item_array[i] = new items_module.Cooked_Bistec;
    //     } else if (player._inventory._item_array[i]._item_type === "Lawn_Mower") {
    //         player._inventory._item_array[i] = new items_module.Lawn_Mower;
    //     } else if (player._inventory._item_array[i]._item_type === "Pizza") {
    //         player._inventory._item_array[i] = new items_module.Pizza;
    //     } else if (player._inventory._item_array[i]._item_type === "Lemon") {
    //         player._inventory._item_array[i] = new items_module.Lemon;
    //     } else if (player._inventory._item_array[i]._item_type === "Shell_Script") {
    //         player._inventory._item_array[i] = new items_module.Shell_Script;
    //     } else if (player._inventory._item_array[i]._item_type === "Hard_To_Swallow_Pills") {
    //         player._inventory._item_array[i] = new items_module.Hard_To_Swallow_Pills;
    //     } else if (player._inventory._item_array[i]._item_type === "Vim") {
    //         player._inventory._item_array[i] = new items_module.Vim;
    //     } else if (player._inventory._item_array[i]._item_type === "Emacs") {
    //         player._inventory._item_array[i] = new items_module.Emacs;
    //     } else if (player._inventory._item_array[i]._item_type === "Wurd") {
    //         player._inventory._item_array[i] = new items_module.Wurd;
    //     } else if (player._inventory._item_array[i]._item_type === "Borger") {
    //         player._inventory._item_array[i] = new items_module.Borger;
    //     } else if (player._inventory._item_array[i]._item_type === "Header_Fries") {
    //         player._inventory._item_array[i] = new items_module.Header_Fries;
    //     } else if (player._inventory._item_array[i]._item_type === "Soda") {
    //         player._inventory._item_array[i] = new items_module.Soda;
    //     } else if (player._inventory._item_array[i]._item_type === "Butterbeer") {
    //         player._inventory._item_array[i] = new items_module.Butterbeer;
    //     } else if (player._inventory._item_array[i]._item_type === "Dry_Martini") {
    //         player._inventory._item_array[i] = new items_module.Dry_Martini;
    //     } else if (player._inventory._item_array[i]._item_type === "Spam_and_eggs") {
    //         player._inventory._item_array[i] = new items_module.Spam_and_eggs;
    //     } else if (player._inventory._item_array[i]._item_type === "Bread_Stacks") {
    //         player._inventory._item_array[i] = new items_module.Bread_Stacks;
    //     } else if (player._inventory._item_array[i]._item_type === "Copypasta") {
    //         player._inventory._item_array[i] = new items_module.Copypasta;
    //     } else if (player._inventory._item_array[i]._item_type === "Tiramisu") {
    //         player._inventory._item_array[i] = new items_module.Tiramisu;
    //     };
    // };