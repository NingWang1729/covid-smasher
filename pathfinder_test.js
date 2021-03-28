var WORLD_MAP = 
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
];
var dfs_move_que = [];
var bfs_move_que = [];
const [row, col] = [2,5];

function canMove(row, col, grid) {
    return (row >= 0 && col >= 0 && row < 24 && col < 40 && grid[row][col] == 0); 
}

function exploreNeighbors(r, c, rq, cq, visited, move_input, grid) {
    // NSEW Change Coordinates
    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, 1, -1];
    for (let i = 0; i < 4; i++) {
        let rr = r + dr[i];
        let cc = c + dc[i];

        if (!canMove(rr, cc, grid)) {
            continue;
        }

        // Adding unvisited Nodes to visited
        rq.unshift(rr);
        cq.unshift(cc);
        visited.push([rr,cc]);
        grid[rr][cc] = 1;

        // Pushing movement input
        if (i == 0) {
            move_input.push(2);
        } else if (i == 1) {
            move_input.push(3);
        } else if (i == 2) {
            move_input.push(0);
        } else if (i == 3) {
            move_input.push(1);
        } 

        
    }
}

function bfs(row, col, grid) {
    var rq = [row];
    var cq = [col];
    var visited = [[row, col]]
    var move_input = []
    grid[row][col] = 1;
    
    while (rq.length > 0) {
        let r = rq.shift();
        let c = cq.shift();

        if (grid[r][c] === 4) {
            return;
        }

        exploreNeighbors(r, c, rq, cq, visited, move_input, grid);
        // console.log(rq, cq);
        // console.log(visited);
        // console.dir(visited, {'maxArrayLength': null});
    }

    return move_input
}


function dfs(row, col, grid) {
    // console.log(row, col);
    grid[row][col] = 1;

    if (grid[row][col] == 4) {
        return 
    }

    if (canMove(row - 1, col, grid)) {
        dfs_move_que.push(2);
        dfs(row - 1, col, grid);
    }
    if (canMove(row, col + 1, grid)) {
        dfs_move_que.push(1);
        dfs(row, col + 1, grid);
    }
    if (canMove(row + 1, col, grid)) {
        dfs_move_que.push(3);
        dfs(row + 1, col, grid);
    }
    if (canMove(row, col - 1, grid)) {
        dfs_move_que.push(0);
        dfs(row, col - 1, grid);
    }


}

const deepCopy = (arr) => {
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}

let dfs_grid = deepCopy(WORLD_MAP);
// console.log(canMove(4,0));
dfs(4,0, dfs_grid);

// console.dir(dfs_move_que, {'maxArrayLength': null});
// console.log(WORLD_MAP);
console.log(dfs_move_que);



function moveableSpaces(grid) {
    let row_col_arr = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] != 1) {
                row_col_arr.push({row: i, col: j});
            }
        }
    }
    return row_col_arr
}

// console.log(moveableSpaces(WORLD_MAP));


// console.log(WORLD_MAP[10][10]);

//   0     1     2    3  4  5   6
// right right right up up up down
function fixNPCMoveQueue(npc_queue) {
    let join_arr = [];
    if (npc_queue[0] != 3) {
        npc_queue.unshift(npc_queue[0])
    }
    for (let i = 1; i < npc_queue.length - 1; i++) {
        let prev = i - 1;
        let next = i;
        if (npc_queue[prev] != npc_queue[next]) {
            console.log(npc_queue.join());
            npc_queue.splice(next, 0, npc_queue[next]);
            console.log(npc_queue.join());
        }
        
    }
    return npc_queue;
} 


// console.log(fixNPCMoveQueue([3,2,2,3,3,2,1,1,0]));


// BFS
let bfs_grid = deepCopy(WORLD_MAP);
console.log(bfs(4, 0, bfs_grid));
// console.log(WORLD_MAP);

let bfs_gridd = deepCopy(WORLD_MAP);
console.log(fixNPCMoveQueue(bfs(4, 0, bfs_gridd)));

