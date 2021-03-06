import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import swal from '@sweetalert/with-react';
import { GoogleLogin } from 'react-google-login'
import './covid_smasher.css';

import * as locationsModule from './base_classes/locations.js'
import * as playerModule from './base_classes/player.js'
import * as itemsModule from './base_classes/items.js'

// Get helper functions
import { deepCopy, getRandomSpawnPoint } from './lib.js'

import axios from 'axios'

const { UNIT_SIZE, TOP_BUFFER, WORLD_WIDTH, WORLD_HEIGHT, WORLD_MAP, DIRECTION } = locationsModule
const { LEFT, RIGHT, UP, DOWN } = DIRECTION

const location_objects = [
    new locationsModule.Home(1, 4),
    new locationsModule.Home(2, 4),
    new locationsModule.Neighbor(5, 4),
    new locationsModule.Cityhall(12, 4),
    new locationsModule.Unary_Store(17, 4),
    new locationsModule.Binary_Store(23, 4),
    new locationsModule.Ternary_Store(28, 4),
    new locationsModule.Mystery_Store(33, 4),
    new locationsModule.Library(2, 13),
    new locationsModule.Object_Garden(23, 11),
    new locationsModule.Cin_N_Cout(27, 11),
    new locationsModule.Cin_N_Cout(28, 11),
    new locationsModule.Cin_N_Cout(29, 11),
    new locationsModule.Foobar(32, 11),
    new locationsModule.Casino(37, 11),
    new locationsModule.HighSchool(7, 22),
    new locationsModule.Work(14, 21),
    new locationsModule.Gym(18, 21),
    new locationsModule.Hospital(22, 21),
    new locationsModule.College(24, 21),
    new locationsModule.College(24, 22)
];

// sort in ascending order for easy binary search
function hashKey(x, y) {
    return 100 * x + y;
}

let obj_pos_map = new Map();
// match position with index of location in location_objects
for (let i = 0; i < location_objects.length; ++i) {
    obj_pos_map.set(hashKey(location_objects[i].x, location_objects[i].y), i);
    console.log(hashKey(location_objects[i].x, location_objects[i].y));
}

const player_selection = [
    new playerModule.Role(2, 5, 100, 100, 40, 45, 50, 'Male Highschool Teen'),
    new playerModule.Role(2, 5, 100, 200, 50, 69, 50, 'Male College Student'),
    new playerModule.Role(2, 5, 100, 50, 30, 50, 30, 'Male Impoverished'),
    new playerModule.Role(2, 5, 100, 1000, 20, 60, 60, 'Male Spoiled Brat'),
    new playerModule.Role(2, 5, 100, 100, 10, 50, 40, 'Male Elderly Person'),
    new playerModule.Role(2, 5, 100, 100, 40, 45, 50, 'Female Highschool Teen'),
    new playerModule.Role(2, 5, 100, 200, 50, 69, 50, 'Female College Student'),
    new playerModule.Role(2, 5, 100, 50, 30, 50, 30, 'Female Impoverished'),
    new playerModule.Role(2, 5, 100, 1000, 20, 60, 60, 'Female Spoiled Brat'),
    new playerModule.Role(2, 5, 100, 100, 10, 50, 40, 'Female Elderly Person'),
];

// Global variables
let player = new playerModule.Role(2, 5, 100, 200, 50, 69, 50, 'Female College Student');
let animated = false;
let animation_stage = 0;
let time = 6;

// Used for MongoDB saving
let email = ''
let gameSaves = {}

// var dfs_map = [
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [0,2,2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,],
//     [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
//     [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,2,0,0,0,2,2,2,0,0,2,0,0,0,0,2,0,0,],
//     [1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
//     [0,0,2,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
//     [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,0,0,0,0,0,0,0,2,0,0,0,2,0,0,0,2,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
//     [1,1,1,1,1,1,1,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,],
// ]

var dfs_map = deepCopy(WORLD_MAP);

// We get a random valid position for our npc to start
// const [rows, cols] = getRandomValidPosition();
// const [rows, cols] = moveableSpaces(WORLD_MAP)[getRandomNumber(0, moveableSpaces(WORLD_MAP).length - 1)];

// console.log("coordinates", rows, cols);
const [rows, cols] = getRandomSpawnPoint();
const [rows2, cols2] = getRandomSpawnPoint();
const [rows3, cols3] = getRandomSpawnPoint();
const [rows4, cols4] = getRandomSpawnPoint();

var npc1 = new playerModule.Role(cols, rows, 100, 50, 30, 50, 30, 'Female Impoverished');
var animation_stage_npc = 0;
var is_animated = true;
var move_directions = [1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,2,2,2,2,2,2,2];

var npc2 = new playerModule.Role(cols2, rows2, 100, 50, 30, 50, 30, 'Male Impoverished');
var animation_stage_npc2 = 0;
var is_animated2 = true;

var npc3 = new playerModule.Role(cols3, rows3, 100, 50, 30, 50, 30, 'Male Impoverished');
var animation_stage_npc3 = 0;
var is_animated3 = true;

var npc4 = new playerModule.Role(cols4, rows4, 100, 50, 30, 50, 30, 'Male Impoverished');
var animation_stage_npc4 = 0;
var is_animated4 = true;

// DFS Algo
let dfs_move_que = []
dfs(rows, cols);
dfs_move_que = fixNPCMoveQueue(dfs_move_que);
move_directions = deepCopy(dfs_move_que);
dfs_move_que = [];
dfs_map = deepCopy(WORLD_MAP);

dfs(rows2, cols2);
dfs_move_que = fixNPCMoveQueue(dfs_move_que);
var move_directions2 = deepCopy(dfs_move_que);
dfs_move_que = [];
dfs_map = deepCopy(WORLD_MAP);

dfs(rows3, cols3);
dfs_move_que = fixNPCMoveQueue(dfs_move_que);
var move_directions3 = deepCopy(dfs_move_que);
dfs_move_que = [];
dfs_map = deepCopy(WORLD_MAP);

dfs(rows4, cols4);
dfs_move_que = fixNPCMoveQueue(dfs_move_que);
var move_directions4 = deepCopy(dfs_move_que);
dfs_move_que = [];
dfs_map = deepCopy(WORLD_MAP);


//   0     1     2    3  4  5   6
// right right right up up up down
function fixNPCMoveQueue(npc_queue) {
    let join_arr = [];
    if (npc_queue[0] !== 3) {
        npc_queue.unshift(npc_queue[0])
    }
    for (let i = 1; i < npc_queue.length - 1; i++) {
        let prev = i - 1;
        let next = i;
        if (npc_queue[prev] != npc_queue[next]) {
            npc_queue.join();
            npc_queue.splice(next, 0, npc_queue[next]);
            npc_queue.join();
        }
        
    }
    return npc_queue;
}

function canMove(row, col) {
    return (row >= 0 && col >= 0 && row < 24 && col < 40 && dfs_map[row][col] != 1); 
}

dfs_move_que = []
function dfs(row, col) {
    dfs_map[row][col] = 1;
    if (dfs_map[row][col] === 4) return

    if (canMove(row - 1, col)) {
        dfs_move_que.push(2);
        dfs(row - 1, col);
    }
    if (canMove(row, col + 1)) {
        dfs_move_que.push(1);
        dfs(row, col + 1);
    }
    if (canMove(row + 1, col)) {
        dfs_move_que.push(3);
        dfs(row + 1, col);
    }
    if (canMove(row, col - 1)) {
        dfs_move_que.push(0);
        dfs(row, col - 1);
    }


}

function isTooClose(player, npc, distance, ticks) {
    // console.log(player.get_x_pos,npc.get_x_pos, player.get_y_pos,npc.get_y_pos)
    if (Math.hypot(player.get_x_pos()-npc.get_x_pos(), player.get_y_pos()-npc.get_y_pos()) <= distance) {
        // alert("You are not social distancing!");
        if (ticks % 2 === 0) {
            player.delta_health = -1;
        }
    }
}

// Comment Out One of these to choose type of pathfinder algo
// Comment Out all algos to set pre-made path

// Random Algo
// move_directions = randomMovement(npc1);

function character_selection(playerClass) {
    player = player_selection[playerClass]
}

function COVID_SMASHER() {
    // CANVAS WIDTH
    const MAX_WIDTH = 1280;
    // CANVAS HEIGHT
    const MAX_HEIGHT = 768;
    // Canvas for drawing the game
    const canvasRef = useRef(null);
    // Play is boolean for play/pause
    const [play, setPlay] = useState(false);
    // ticks decide in game movement etc.
    const [ticks, setTicks] = useState(0);
    // Movequeue for storing keyboard inputs
    const [moves, setMoves] = useState([]);
    // Game state
    const [game_state, setGameState] = useState(3); // 0 = World Map, 1 = Pause Menu, 2 = Character Selection, 3 = Load Screen
    // Setup
    const [setup, setSetup] = useState(true);
    // Library
    const [books, setBooks] = useState(["graph theory", "algebra", "digital art", "lucid dreams", "baking bread",
                                        "alchemy", "philosophy", "pistachio farming", "literacy rates", "books"]);
    
    // Initializes display screen
    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        var audio = document.getElementById("background_audio");
        audio.volume = 0.025;
        audio.play();
    }, []);

    // Game Clock
    useEffect(()=>{
        setTimeout(counter, 100);
    }, [ticks]);

    // Game Clock
    function counter () {
        var audio = document.getElementById("background_audio");
        if (audio.currentTime >= 75.4) {
            audio.currentTime = 0.5;
        };
        switch (game_state) {
            case 0: // WORLD MAP
                pass_time(0.001);
                update_game_0();
                break;
            case 1: // PAUSE MENU
                update_game_1();
                break;
            case 2: // CHARACTER SELECTION SCREEN
                update_game_2();
                break;
            case 3: // LOAD SCREEN
                update_game_3();
                break;
            default:
                pass_time(0.001);
                update_game_0();
                setGameState(0);
                break;
        }
        setTicks(ticks + 1)
    }
        
    // Function to reuse first made for NPC
    function updateFacingDirection(a_stage, is_animated, character, queue) {
        if (queue.length > 0 && (a_stage === 0 || a_stage === 4)) {
            switch (queue[0]) {
                case 0:
                    if (character.direction === LEFT && character.x_pos > 0 && (WORLD_MAP[character.y_pos][character.x_pos - 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos - 1] === 2)) {
                        is_animated = true;
                    } else {
                        // alert("Facing left");
                        a_stage = 0;
                        is_animated = false;
                    };
                    break;
                case 1:
                    if (character.direction === RIGHT && character.x_pos < WORLD_WIDTH - 1 && (WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || WORLD_MAP[character.y_pos][character.x_pos + 1] === 2)) {
                        is_animated = true;
                    } else {
                        // alert("Facing right");
                        a_stage = 0;
                        is_animated = false;
                    };
                    break;
                case 2:
                    if (character.direction === UP && character.y_pos > 0 && (WORLD_MAP[character.y_pos - 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos - 1][character.x_pos] === 2)) {
                        is_animated = true;
                    } else {
                        // alert("Facing up");
                        a_stage = 0;
                        is_animated = false;
                    };
                    break;
                case 3:
                    if (character.direction === DOWN && character.y_pos < WORLD_HEIGHT - 1 && (WORLD_MAP[player.y_pos + 1][character.x_pos] === 0 || WORLD_MAP[character.y_pos + 1][character.x_pos] === 2)) {
                        is_animated = true;
                    } else {
                        // alert("Facing down");
                        a_stage = 0;
                        is_animated = false;
                    };
                    break;
                default:
                    break;
            };
        };
    }

    // WORLD MAP
    function update_game_0 () {
        if (player._substenance <= 0 && ticks % 20 === 0) {
            swal("Game Over!", "You died from starvation!", "error").then(() => {
                swal(<p>The UN warns of <a href="https://townhall.com/tipsheet/bronsonstocking/2020/04/22/so-130-million-people-could-starve-because-of-the-lockdowns-n2567446" target="_blank">Mass Starvation</a> due to COVID-19.</p>);
            });
        } else if (player._hp <= 0 && ticks % 20 === 0) {
            swal("Game Over!", "You died from injuries!", "error").then(() => {
                swal(<p><a href="https://www.worldometers.info/coronavirus/" target="_blank">Millions of people</a> have died from COVID-19.</p>);
            });
        } else if ((player._substenance > 0 && player._substenance <= 50 || player._hp > 0 && player._hp <= 50) && ticks % 200 === 0) {
            swal("You're not looking so good!", "Try increasing your substenance and hp.", "info")
        }
        // Same as code below
        updateFacingDirection(animation_stage_npc, is_animated, npc1, move_directions);
        updateFacingDirection(animation_stage_npc2, is_animated2, npc2, move_directions2);
        updateFacingDirection(animation_stage_npc3, is_animated3, npc3, move_directions3);
        updateFacingDirection(animation_stage_npc4, is_animated4, npc4, move_directions4);

        let movequeue = moves;
        if (moves.length > 0 && (animation_stage === 0 || animation_stage === 4)) {
            pass_time(0.01);
            switch (movequeue[0]) {
                case 0:
                    if (player.direction === LEFT && player.x_pos > 0 && (WORLD_MAP[player.y_pos][player.x_pos - 1] === 0 || WORLD_MAP[player.y_pos][player.x_pos - 1] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 1:
                    if (player.direction === RIGHT && player.x_pos < WORLD_WIDTH - 1 && (WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || WORLD_MAP[player.y_pos][player.x_pos + 1] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 2:
                    if (player.direction === UP && player.y_pos > 0 && (WORLD_MAP[player.y_pos - 1][player.x_pos] === 0 || WORLD_MAP[player.y_pos - 1][player.x_pos] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 3:
                    if (player.direction === DOWN && player.y_pos < WORLD_HEIGHT - 1 && (WORLD_MAP[player.y_pos + 1][player.x_pos] === 0 || WORLD_MAP[player.y_pos + 1][player.x_pos] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                default:
                    break;
            };
        };

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears entire canvas
        ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT + TOP_BUFFER);

       // Environmental Assets
        let dirt_path = document.getElementById("dirt-path");
        ctx.drawImage(dirt_path, 0, 0 + TOP_BUFFER, WORLD_WIDTH * UNIT_SIZE, WORLD_HEIGHT * UNIT_SIZE);

        let grass = document.getElementById("grass");
        ctx.drawImage(grass, 0, 8 + TOP_BUFFER, WORLD_WIDTH * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.drawImage(grass, 0, 256 + TOP_BUFFER, 5 * UNIT_SIZE, 5 * UNIT_SIZE);
        ctx.drawImage(grass, 708, 232 + TOP_BUFFER, 18 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.drawImage(grass, 0, 500 + TOP_BUFFER, 8 * UNIT_SIZE, 8.5 * UNIT_SIZE);
       
        ctx.drawImage(grass, 384, 550 + TOP_BUFFER, 14 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.drawImage(grass, 768, 520 + TOP_BUFFER, 16 * UNIT_SIZE, 8 * UNIT_SIZE);


        let tree_2 = document.getElementById("tree-2");
        let total_pixel_width = WORLD_WIDTH * UNIT_SIZE
        for (let i = -UNIT_SIZE; i < total_pixel_width; i+=32) {
            ctx.drawImage(tree_2, i, -70 + TOP_BUFFER);
            ctx.drawImage(tree_2, i, -60 + TOP_BUFFER);
            ctx.drawImage(tree_2, i, -50 + TOP_BUFFER);
            ctx.drawImage(tree_2, i, -40 + TOP_BUFFER);
            ctx.drawImage(tree_2, i, -30 + TOP_BUFFER);
        }


        // Buildings
        if (player._type === "Male Impoverished" || player._type === "Female Impoverished") {
            let apartment = document.getElementById("apartment");
            ctx.drawImage(apartment, 0, -48 + TOP_BUFFER);
        } else if (player._type === "Male Spoiled Brat" || player._type === "Female Spoiled Brat") {
            let home = document.getElementById("villa");
            ctx.drawImage(home, 0, 0 + TOP_BUFFER);
        } else {
            let home = document.getElementById("house");
            ctx.drawImage(home, 0, 0 + TOP_BUFFER);
        }

        const neighbor = document.getElementById("neighbor");
        ctx.drawImage(neighbor, 128, -24 + TOP_BUFFER);

        const city_hall = document.getElementById("city-hall");
        ctx.drawImage(city_hall, 256, -56 + TOP_BUFFER);

        const store_1 = document.getElementById("store-1");
        ctx.drawImage(store_1, 496, -12 + TOP_BUFFER);

        const store_2 = document.getElementById("store-2");
        ctx.drawImage(store_2, 666, -8 + TOP_BUFFER);

        const store_3 = document.getElementById("store-3");
        ctx.drawImage(store_3, 832, -4 + TOP_BUFFER);

        const store_4 = document.getElementById("store-4");
        ctx.drawImage(store_4, 983, 8 + TOP_BUFFER);

        const tree_1 = document.getElementById("tree-1");
        ctx.drawImage(tree_1, 1152, 32 + TOP_BUFFER);

        // Row 2
        const library = document.getElementById("library");
        ctx.drawImage(library, -4, 256 + TOP_BUFFER);

        const park = document.getElementById("park");
        ctx.drawImage(park, 288, 224 + TOP_BUFFER);

        const object_garden = document.getElementById('object-garden')
        ctx.drawImage(object_garden, 708, 232 + TOP_BUFFER);

        const cin_n_cout = document.getElementById("cin-n-cout");
        ctx.drawImage(cin_n_cout, 840, 224 + TOP_BUFFER);

        const foobar = document.getElementById("foobar");
        ctx.drawImage(foobar, 976, 225 + TOP_BUFFER);

        const casino = document.getElementById("casino");
        ctx.drawImage(casino, 1128, 220 + TOP_BUFFER);

        // Row 3
        const highschool = document.getElementById("highschool");
        ctx.drawImage(highschool, -3, 500 + TOP_BUFFER);

        const work = document.getElementById("work");
        ctx.drawImage(work, 384, 550 + TOP_BUFFER);

        const gym = document.getElementById("gym");
        ctx.drawImage(gym, 524, 524 + TOP_BUFFER);

        const hospital = document.getElementById("hospital");
        ctx.drawImage(hospital, 666, 543 + TOP_BUFFER, 128, 128);

        const college_doormat = document.getElementById("college-doormat");
        ctx.drawImage(college_doormat, 768, 456 + TOP_BUFFER);

        // Draw player
        draw_sprite(ctx, player.direction, player._type, player);

        // Draw npc
        draw_sprite_npc(ctx, npc1.direction, "NPC1", npc1);
        draw_sprite_npc2(ctx, npc2.direction, "NPC2", npc2);
        draw_sprite_npc3(ctx, npc3.direction, "NPC3", npc3);
        draw_sprite_npc4(ctx, npc4.direction, "NPC4", npc4);
        

        let college = document.getElementById("college-without-doormat");
        ctx.drawImage(college, 768, 456 + TOP_BUFFER);

        // Add shading
        if (time >= 12) {
            let light = (time - 12) / 18;
            ctx.fillStyle = `rgba(0, 0, 0, ${light})`;
        } else {
            let light = (12 - time) / 18;
            ctx.fillStyle = `rgba(0, 0, 0, ${light})`;
        }
        ctx.fillRect(0, 0, MAX_WIDTH, MAX_HEIGHT + TOP_BUFFER);

        // Moves NPC same as code below
        moveNPC(npc1, move_directions, animation_stage_npc);
        moveNPC(npc2, move_directions2, animation_stage_npc2);
        moveNPC(npc3, move_directions3, animation_stage_npc3);
        moveNPC(npc4, move_directions4, animation_stage_npc4);

        if (moves.length > 0 && (animation_stage === 0 || animation_stage === 3)) {
            switch (movequeue[0]) {
                case 0:
                    if (player.direction === LEFT) {
                        if (!player.move(LEFT)) {
                            play_wall_bump_audio();
                        }
                    } else {
                        player.set_direction(LEFT);
                    };
                    break;
                case 1:
                    if (player.direction === RIGHT) {
                        if (!player.move(RIGHT)) {
                            play_wall_bump_audio();
                        }
                    } else {
                        player.set_direction(RIGHT);
                    };
                    break;
                case 2:
                    if (player.direction === UP) {
                        if (!player.move(UP)) {
                            play_wall_bump_audio();
                        }
                    } else {
                        player.set_direction(UP);
                    };
                    break;
                case 3:
                    if (player.direction === DOWN) {
                        if (!player.move(DOWN)) {
                            play_wall_bump_audio();
                        }
                    } else {
                        player.set_direction(DOWN);
                    };
                    break;
                case 4:
                    if (WORLD_MAP[player.y_pos][player.x_pos] === 2) {
                        let hashedPos = hashKey(player.get_x_pos(), player.get_y_pos());
                        console.log(obj_pos_map.get(hashedPos));
                        
                        if (player.isAt(1, 4) || player.isAt(2, 4)) {
                            swal("You arrived home! What do you want to do?", {
                                buttons: {
                                  leave: {
                                    text: "Leave for now...",
                                    value: "leave",
                                  },
                                  rest: {
                                    text: "Rest until tomorrow (6AM)",
                                    value: "rest",
                                  },
                                },
                            }).then((value) => {
                                switch (value) {
                                    case "rest":
                                        swal("ZZZZZ", "You took a nice long nap!", "success");
                                        if (obj_pos_map.has(hashedPos)) {
                                            location_objects[obj_pos_map.get(hashedPos)].do_something(player);
                                            play_sleeping_audio();
                                        };
                                        time = 6;
                                        break;
                                    case "leave":
                                        swal("You decided not to go home just yet.");
                                        break;
                                    default:
                                        swal("You decided not to go home just yet.");
                                        break;
                                };
                            });
                        } else if (player.isAt(5, 4)) {
                            swal("You arrived at your neighbor's house! What do you want to do?", {
                                buttons: {
                                  leave: {
                                    text: "Leave for now...",
                                    value: "leave",
                                  },
                                  enter: {
                                    text: "Visit neighbor...",
                                    value: "enter",
                                  },
                                },
                            }).then((value) => {
                                switch (value) {
                                    case "enter":
                                        swal("Achoo!", "You were infected and took damage!", "error").then(()=>{
                                            swal(<p>Here are some reasons why <a href="https://www.forbes.com/sites/startswithabang/2020/04/24/these-are-the-dangers-of-visiting-even-one-friend-during-the-covid-19-pandemic/?sh=2102feb91783" target="_blank">you shouldn't visit your neighbors</a> during the middle of a pandemic.</p>)
                                        });
                                        if (obj_pos_map.has(hashedPos)) {
                                            location_objects[obj_pos_map.get(hashedPos)].do_something(player);
                                            pass_time(0.5);
                                        };
                                        break;
                                    case "leave":
                                        swal("You decided not to visit your neighbor.");
                                        break;
                                    default:
                                        swal("You decided not to visit your neighbor.");
                                        break;
                                };
                            });
                        } else if (player.isAt(12, 4)) {
                            swal("You arrived at City Hall!! What do you want to do?", {
                                buttons: {
                                  leave: {
                                    text: "Leave for now...",
                                    value: "leave",
                                  },
                                  enter: {
                                    text: "Collect social security benefits...",
                                    value: "enter",
                                  },
                                },
                            }).then((value) => {
                                switch (value) {
                                    case "enter":
                                        if (obj_pos_map.has(hashedPos)) {
                                            let result = location_objects[obj_pos_map.get(hashedPos)].do_something(player);
                                            if (result === 1) {
                                                swal("Memories!", "You recall your days of old!", "info").then(()=>{
                                                    swal("Happy thoughts", "You recall happy memories...", "success");
                                                });
                                            } else if (result === 0) {
                                                swal("Memories!", "You recall your days of old!", "info").then(()=>{
                                                    swal("Hxppy Thxxghts", "You recall traumatic events...", "error").then(() => {
                                                        swal(<p>The average wait time at the DMV is 2-3 hours! This is a huge issue for the elderly, disabled, and impatient. Find your <a href="https://www.house.gov/representatives/find-your-representative" target="_blank">representative</a> and let them know your concern!</p>);
                                                    });
                                                });
                                            } else {
                                                swal("Nothing!", "You don't qualify for social security yet! You were fined $10.", "error");
                                            };
                                            pass_time(2 + Math.random());
                                        };
                                        break;
                                    case "leave":
                                        swal("You decided not to visit the government. Taxation is theft, anyways.");
                                        break;
                                    default:
                                        swal("You decided not to visit City hall.");
                                        break;
                                }
                            });
                            
                        } else if (player.isAt(17, 4)) {
                          swal(
                            'You arrived at the Unary-Store! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy plastic meat for $1?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy plastic water for $1?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy spidget finner for $1?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Hey, you got a plastic meat(ball? clump?)! (Sounds... edible?)'
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      "Hey, you got a plastic water! (Aside: What's a plastic water?)"
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Hey, you got a spidget finner! *nice*'
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal(
                                  'You decided not to visit the Unary Store.'
                                )
                                break
                              default:
                                swal(
                                  'You decided not to visit the Unary Store.'
                                )
                                break
                            }
                          })
                          
                        } else if (player.isAt(23, 4)) {
                          swal(
                            'You arrived at the Binary-Store! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy cooked chicken for $2?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy cooked bistec for $4?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy lawn mower for $8?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Hey, you got a cooked chicken!')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Hey, you got a cooked bistec!')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Hey, you got a lawn mower! (But why tho...)'
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal(
                                  'You decided not to visit the Binary Store.'
                                )
                                break
                              default:
                                swal(
                                  'You decided not to visit the Binary Store.'
                                )
                                break
                            }
                          })
                        } else if (player.isAt(28, 4)) {
                          swal(
                            'You arrived at the Ternary-Store! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy pizza for $3?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy lemon for $9?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy shell script for $27?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Hey, you got a pizza! (Wanna share?)')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Hey, life gave you a lemon! (Make life take the lemon back!))'
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Hey, you got a shell script! #!/bin/bash; cd ~/;'
                                    )
                                  } else {
                                    swal(
                                      "You were unable to purchase this item! (Can your inventory even be too full for a shell script? It's just a few bytes!)"
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal(
                                  'You decided not to visit the Ternary Store.'
                                )
                                break
                              default:
                                swal(
                                  'You decided not to visit the Ternary Store.'
                                )
                                break
                            }
                          })
                        } else if (player.x_pos === 33 && player.y_pos === 4) {
                          swal(
                            'You arrived at the Mystery-Store! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy hard to swallow pills for $10?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy vim for $5?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy EMACS for $20?',
                                  value: 'item3',
                                },
                                item4: {
                                  text: 'Buy Wurd for $15?',
                                  value: 'item4',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('How will you swallow these?')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Vim?',
                                      "idk, let's look it up",
                                      'info'
                                    ).then(() => {
                                      swal(
                                        <a
                                          href="https://www.google.com/search?q=vi"
                                          target="_blank"
                                        >
                                          https://www.google.com/search?q=vi
                                        </a>
                                      )
                                    })
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Emacs?',
                                      "idk, let's look it up",
                                      'info'
                                    ).then(() => {
                                      swal(
                                        <a
                                          href="https://www.google.com/search?q=emacs"
                                          target="_blank"
                                        >
                                          https://www.google.com/search?q=emacs
                                        </a>
                                      )
                                    })
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item4':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 4)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Bird is the wurd!')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal(
                                  "You decided not to visit the Mystery Store. (Are you sure it's not a gym?)"
                                )
                                break
                              default:
                                swal(
                                  'You decided not to visit the Mystery Store.'
                                )
                                break
                            }
                          })
                        } else if (player.x_pos === 2 && player.y_pos === 13) {
                          swal(
                            'You arrived at the library! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                enter: {
                                  text: 'Read a book...',
                                  value: 'enter',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'enter':
                                swal(
                                  'Success!',
                                  `You read a book about ${
                                    books[Math.trunc(10 * Math.random())]
                                  }...`,
                                  'success'
                                ).then(() => {
                                  swal(
                                    <p>
                                      With libraries no longer open in person,
                                      you can checkout over 60,000 free ebooks
                                      at the{' '}
                                      <a
                                        href="http://www.gutenberg.org/"
                                        target="_blank"
                                      >
                                        Gutenberg Project!
                                      </a>
                                    </p>
                                  )
                                })
                                if (obj_pos_map.has(hashedPos)) {
                                  location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player)
                                  pass_time(1.5)
                                }
                                break
                              case 'leave':
                                swal('You decided not to enter the library.')
                                break
                              default:
                                swal('You decided not to enter the library.')
                                break
                            }
                          })
                        } else if (player.x_pos === 23 && player.y_pos === 11) {
                          swal(
                            'You arrived at Object Garden! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy Breadstacks for $6?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy Copypasta for $20?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy Tiramisu for $8?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal("Where's the lamb sauce?")
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Somebody toucha my spaghet?')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time((3 / 2) * Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Delicious. Finally, some tiramisu.')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal('You decided not to visit Object-Garden.')
                                break
                              default:
                                swal('You decided not to visit Object-Garden.')
                                break
                            }
                          })
                        } else if (
                          (player.x_pos === 27 ||
                            player.x_pos === 28 ||
                            player.x_pos === 29) &&
                          player.y_pos === 11
                        ) {
                          swal(
                            'You arrived at Cin-N-Cout! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy Borger for $3?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy Header Fries for $2?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy soda for $1?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Mmm, Borger. Yum.')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Is this even French?')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      "Soda? Candy pop? What's the difference?"
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random())
                                }
                                break
                              case 'leave':
                                swal('You decided not to visit Cin-N-Out.')
                                break
                              default:
                                swal('You decided not to visit Cin-N-Out.')
                                break
                            }
                          })
                        } else if (player.x_pos === 32 && player.y_pos === 11) {
                          swal(
                            'You arrived at Foobar! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                item1: {
                                  text: 'Buy Butterbeer for $2?',
                                  value: 'item1',
                                },
                                item2: {
                                  text: 'Buy Dry Martini for $3?',
                                  value: 'item2',
                                },
                                item3: {
                                  text: 'Buy spam and eggs for $5?',
                                  value: 'item3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'item1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result) {
                                    play_item_received_audio()
                                    swal(
                                      'Did you get your permission slip signed for Hogsmeade?'
                                    )
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random() / 2)
                                }
                                break
                              case 'item2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Stirred, not shaken, right?')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random() / 2)
                                }
                                break
                              case 'item3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result) {
                                    play_item_received_audio()
                                    swal('Wait, this is not pythonic...')
                                  } else {
                                    swal(
                                      'You were unable to purchase this item!'
                                    )
                                  }
                                  pass_time(Math.random() / 2)
                                }
                                break
                              case 'leave':
                                swal('You decided not to visit Foobar.')
                                break
                              default:
                                swal('You decided not to visit Foobar.')
                                break
                            }
                          })
                        } else if (player.x_pos === 37 && player.y_pos === 11) {
                          swal(
                            'You arrived at the Game Corner! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                slots: {
                                  text: 'Play slots for $1?',
                                  value: '1',
                                },
                                blackjack: {
                                  text:
                                    'Play blackjack for $2? House pays 3 to 2.',
                                  value: '2',
                                },
                                roulette: {
                                  text: 'Play roulette?',
                                  value: '3',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case '1':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 1)
                                  if (result === 1) {
                                    swal('Success!', 'You won $2!', 'success')
                                    pass_time(0.5)
                                  } else if (result === 0) {
                                    swal(
                                      'Uh-oh!',
                                      'You lost your money!',
                                      'error'
                                    )
                                    pass_time(0.5)
                                  } else {
                                    swal(
                                      'Hold up...',
                                      "You don't have enough money!",
                                      'error'
                                    )
                                  }
                                }
                                break
                              case '2':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 2)
                                  if (result === 1) {
                                    swal(
                                      'Success!',
                                      'House pays 3 to 2.',
                                      'success'
                                    )
                                    pass_time(1.5)
                                  } else if (result === 0) {
                                    swal('Uh-oh!', 'You went bust!', 'error')
                                    pass_time(1.5)
                                  } else {
                                    swal(
                                      'Hold up...',
                                      "You don't have enough money!",
                                      'error'
                                    )
                                  }
                                }
                                break
                              case '3':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player, 3)
                                  if (result === 1) {
                                    swal(
                                      'Success!',
                                      'You pulled a blank. (What, did you expect money?)',
                                      'success'
                                    )
                                    pass_time(2.5)
                                  } else if (result === 0) {
                                    swal(
                                      'Uh-oh!',
                                      "You lost Russian Roulette! (Didn't see that one coming.)",
                                      'error'
                                    )
                                    pass_time(2.5)
                                  } else {
                                    swal(
                                      'Hold up...',
                                      "You don't have enough money!",
                                      'error'
                                    )
                                  }
                                }
                                break
                              case 'leave':
                                swal(
                                  'You decided not to enter the Game Corner.'
                                )
                                break
                              default:
                                swal(
                                  'You decided not to enter the Game Corner.'
                                )
                                break
                            }
                          })
                        } else if (player.x_pos === 7 && player.y_pos === 22) {
                          swal(
                            'You arrived at the highschool! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                enter: {
                                  text: 'Go to class...',
                                  value: 'enter',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'enter':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player)
                                  if (result === 1) {
                                    swal(
                                      'Success!',
                                      'You went to class as usual.',
                                      'success'
                                    )
                                    pass_time(1.5)
                                  } else if (result === 0) {
                                    swal(
                                      'Uh-oh!',
                                      'You were unable to concentrate.',
                                      'error'
                                    ).then(() => {
                                      swal(
                                        <p>
                                          Remote learning has made education
                                          more difficult all around the country,
                                          with{' '}
                                          <a
                                            href="https://www.cbsnews.com/news/coronavirus-pandemic-students-grades-suffering-all-remote-learning/"
                                            target="_blank"
                                          >
                                            higher rates of failing classes
                                          </a>
                                          . This has been significantly worse in
                                          more rural and poorer areas.
                                        </p>
                                      )
                                    })
                                    pass_time(1.5)
                                  } else {
                                    swal(
                                      'Hold up...',
                                      'You are not a highschooler! What a silly mistake...',
                                      'error'
                                    )
                                  }
                                }
                                break
                              case 'leave':
                                swal('You decided not to enter the highschool.')
                                break
                              default:
                                swal('You decided not to enter the highschool.')
                                break
                            }
                          })
                        } else if (player.x_pos === 14 && player.y_pos === 21) {
                          swal('You arrived at work! What do you want to do?', {
                            buttons: {
                              leave: {
                                text: 'Leave for now...',
                                value: 'leave',
                              },
                              enter: {
                                text: 'Go to work...',
                                value: 'enter',
                              },
                            },
                          }).then(value => {
                            switch (value) {
                              case 'enter':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player)
                                  switch (result) {
                                    case 0:
                                      swal(
                                        <p>
                                          You worked{' '}
                                          <a
                                            href="https://www.investopedia.com/articles/markets-economy/090516/what-are-pros-and-cons-raising-minimum-wage.asp"
                                            target="_blank"
                                          >
                                            minimum wage
                                          </a>
                                          !
                                        </p>
                                      )
                                      pass_time(1)
                                      break
                                    case 1:
                                      swal(
                                        <p>
                                          You worked at an{' '}
                                          <a
                                            href="https://technologyadvice.com/blog/human-resources/company-needs-start-paying-interns/"
                                            target="_blank"
                                          >
                                            unpaid internship
                                          </a>
                                          !
                                        </p>
                                      )
                                      pass_time(3)
                                      break
                                    case 2:
                                      swal(
                                        <p>
                                          You worked at a{' '}
                                          <a
                                            href="https://www.thebalancecareers.com/the-pros-and-cons-of-working-at-a-startup-company-3859588"
                                            target="_blank"
                                          >
                                            tech startup
                                          </a>
                                          !
                                        </p>
                                      )
                                      pass_time(3)
                                      break
                                    case 3:
                                      swal(
                                        <p>
                                          You lost your job due to{' '}
                                          <a
                                            href="https://www.thebalance.com/how-outsourcing-jobs-affects-the-u-s-economy-3306279"
                                            target="_blank"
                                          >
                                            outsourcing
                                          </a>
                                          ! (In game hint: Try raising your
                                          intelligence stat! This is harder in
                                          real life.)
                                        </p>
                                      )
                                      pass_time(2)
                                      break
                                    case 4:
                                      swal(
                                        <p>
                                          You received{' '}
                                          <a
                                            href="https://www.youtube.com/watch?v=iik25wqIuFo"
                                            target="_blank"
                                          >
                                            a small loan of $100
                                          </a>
                                          !
                                        </p>
                                      )
                                      pass_time(2)
                                      break
                                    case 5:
                                      swal(
                                        <p>
                                          You remember that you are retired and
                                          should go collect{' '}
                                          <a
                                            href="https://abcnews.go.com/Politics/social-security-running-money-benefits-track-reduced-2035/story?id=62557507"
                                            target="_blank"
                                          >
                                            social security benefits
                                          </a>{' '}
                                          from the city hall while it lasts!
                                        </p>
                                      )
                                      pass_time(1)
                                      break
                                    default:
                                      break
                                  }
                                }
                                break
                              case 'leave':
                                swal('You decided not to go to work.')
                                break
                              default:
                                swal('You decided not to go to work.')
                                break
                            }
                          })
                        } else if (player.x_pos === 18 && player.y_pos === 21) {
                          swal(
                            'You arrived at the gym! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                enter: {
                                  text: 'Workout ($10 fine for violation!)',
                                  value: 'enter',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'enter':
                                if (obj_pos_map.has(hashedPos)) {
                                  if (
                                    location_objects[
                                      obj_pos_map.get(hashedPos)
                                    ].do_something(player)
                                  ) {
                                    swal(
                                      'Phew!',
                                      'What a great workout!',
                                      'success'
                                    ).then(() => {
                                      swal(
                                        <p>
                                          With an uneasy economy, learn more
                                          about how{' '}
                                          <a
                                            href="https://kmph.com/news/local/governor-newsom-shuts-down-gyms-and-hair-salons-again"
                                            target="_blank"
                                          >
                                            COVID-19 shutdowns
                                          </a>{' '}
                                          further hurt struggling, small
                                          businesses.
                                        </p>
                                      )
                                    })
                                    pass_time(2)
                                  } else {
                                    swal(
                                      'Uh-oh',
                                      "You don't have enough cash!",
                                      'error'
                                    )
                                  }
                                }
                                break
                              case 'leave':
                                swal('You decided not to enter the gym.')
                                break
                              default:
                                swal('You decided not to enter the gym.')
                                break
                            }
                          })
                        } else if (player.x_pos === 22 && player.y_pos === 21) {
                          swal(
                            'You arrived at the hospital! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                enter: {
                                  text: 'Check vaccine progress...',
                                  value: 'enter',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'enter':
                                if (obj_pos_map.has(hashedPos)) {
                                  if (
                                    location_objects[
                                      obj_pos_map.get(hashedPos)
                                    ].do_something(player)
                                  ) {
                                    swal(
                                      'You Win!',
                                      'You received the vaccine!.',
                                      'success'
                                    )
                                  } else {
                                    swal(
                                      <p>
                                        Check again when you have 100 in
                                        strength, intelligence, or morale, and{' '}
                                        <a
                                          href="https://www.cdc.gov/coronavirus/2019-ncov/vaccines/expect.html"
                                          target="_blank"
                                        >
                                          learn more
                                        </a>{' '}
                                        about{' '}
                                        <a
                                          href="https://www.defense.gov/Explore/Spotlight/Coronavirus/Operation-Warp-Speed/"
                                          target="_blank"
                                        >
                                          the COVID-19 vaccine.
                                        </a>
                                      </p>
                                    )
                                  }
                                  pass_time(0.1)
                                }
                                break
                              case 'leave':
                                swal('You decided not to enter the hospital.')
                                break
                              default:
                                swal('You decided not to enter the hospital.')
                                break
                            }
                          })
                        } else if (
                          player.x_pos === 24 &&
                          (player.y_pos === 21 || player.y_pos === 22)
                        ) {
                          swal(
                            'You arrived at the college! What do you want to do?',
                            {
                              buttons: {
                                leave: {
                                  text: 'Leave for now...',
                                  value: 'leave',
                                },
                                enter: {
                                  text: 'Enter college...',
                                  value: 'enter',
                                },
                              },
                            }
                          ).then(value => {
                            switch (value) {
                              case 'enter':
                                if (obj_pos_map.has(hashedPos)) {
                                  let result = location_objects[
                                    obj_pos_map.get(hashedPos)
                                  ].do_something(player)
                                  switch (result) {
                                    case 0:
                                      swal(
                                        <p>
                                          You went to college and paid part of
                                          your{' '}
                                          <a
                                            href="https://www.investopedia.com/student-loan-debt-2019-statistics-and-outlook-4772007"
                                            target="_blank"
                                          >
                                            tuition
                                          </a>
                                          !
                                        </p>
                                      )
                                      pass_time(2)
                                      break
                                    case 1:
                                      swal(
                                        <p>
                                          You could not afford a guided tour of
                                          the campus!
                                        </p>
                                      )
                                      pass_time(1)
                                      break
                                    case 2:
                                      swal(
                                        <p>
                                          You went on a guided tour of the
                                          beautiful campus.
                                        </p>
                                      )
                                      pass_time(1)
                                      break
                                    default:
                                      break
                                  }
                                }
                                break
                              case 'leave':
                                swal('You decided not to visit the college.')
                                break
                              default:
                                swal('You decided not to visit the college.')
                                break
                            }
                          })
                        };
                    };
                    break;
                default:
                    break;
            };
            movequeue.shift();
            setMoves(movequeue);
        };

        isTooClose(player, npc1, 1.5, ticks);
        isTooClose(player, npc2, 1.5, ticks);
        isTooClose(player, npc3, 1.5, ticks);
        isTooClose(player, npc4, 1.5, ticks);
    }

    function moveNPC(character, move_directions, animation_stage_npc) {
        if (move_directions.length > 0 && (animation_stage_npc === 0 || animation_stage_npc === 3)) {
            switch (move_directions[0]) {
                case 0:
                    if (character.direction === LEFT) {
                        character.move(LEFT);
                    } else {
                        character.set_direction(LEFT);
                    };
                    break;
                case 1:
                    if (character.direction === RIGHT) {
                        character.move(RIGHT);
                    } else {
                        character.set_direction(RIGHT);
                    };
                    break;
                case 2:
                    if (character.direction === UP) {
                        character.move(UP);
                    } else {
                        character.set_direction(UP);
                    };
                    break;
                case 3:
                    if (character.direction === DOWN) {
                        character.move(DOWN);
                    } else {
                        character.set_direction(DOWN);
                    };
                    break;
                }

            move_directions.shift();
        }
    }

    // Adds text/avatar image to each of the slots
    function addSlotText(x, slotData, ctx) {
        const y = MAX_HEIGHT / 3 - 2 * UNIT_SIZE
        const width = MAX_WIDTH / 4 + 1 * UNIT_SIZE
        const height = MAX_HEIGHT / 2 + 4 * UNIT_SIZE

        ctx.textAlign = 'left'
        ctx.fillText(`  ${new Date(slotData.savedAt).toDateString()}`, x + UNIT_SIZE * 2, y + UNIT_SIZE * 3, width, height)
        ctx.fillText(`  Character: ${slotData.playerType}  `, x, y + UNIT_SIZE * 4, width, height)
        ctx.fillText(`  Time: ${formatTime(slotData.time)} | Money: $${slotData.money}`, x, y + UNIT_SIZE * 5, width, height)
        // ctx.fillText(`  `, x + UNIT_SIZE * 3, y + UNIT_SIZE * 6, width, height)
        ctx.fillText(`  Health: ${slotData.stats.health} | Strength: ${slotData.stats.strength}`, x, y + UNIT_SIZE * 6, width, height)
        ctx.fillText(`  Sustenance: ${Math.floor(slotData.stats.sustenance)} | Morale: ${slotData.stats.morale}`, x, y + UNIT_SIZE * 7, width, height)
        ctx.fillText(`  Intelligence: ${slotData.stats.intelligence}`, x + UNIT_SIZE * 2, y + UNIT_SIZE * 8, width, height)
        ctx.drawImage(document.getElementById(slotData.playerType), 128, 64, 64, 64, x + UNIT_SIZE * 1.625, y + UNIT_SIZE * 6 + TOP_BUFFER, 256, 256);
    }

    // PAUSE MENU
    async function update_game_1() {
        // gameSaves = await getSavedSlots()
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears most of the canvas
        ctx.clearRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Pause menu background color
        ctx.fillStyle = "beige";
        ctx.fillRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Pause menu border
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Pause menu pause text
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.fillText("PAUSED", MAX_WIDTH / 2, MAX_HEIGHT / 4 - 2 * UNIT_SIZE, 6 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Pause menu pause text border
        ctx.rect(MAX_WIDTH / 2 - 3 * UNIT_SIZE, MAX_HEIGHT / 4 - 3.5 * UNIT_SIZE, 6 * UNIT_SIZE, 2 * UNIT_SIZE);

        ctx.font = '30px serif';
        ctx.textAlign = "left";

        // Add text/stats for all the slots
        const xPositions = [2 * UNIT_SIZE, MAX_WIDTH / 3 + 1 * UNIT_SIZE, (MAX_WIDTH * 2) / 3]
        for (let x = 0; x < 3; x++) if (gameSaves[x+1]) addSlotText(xPositions[x], gameSaves[x+1], ctx)

        // Save Slot 1 text border
        // TO-DO: Replace y, width, and height with constants for all of these
        ctx.rect(xPositions[0], MAX_HEIGHT / 3 - 2 * UNIT_SIZE,  MAX_WIDTH / 4 + 1 * UNIT_SIZE, MAX_HEIGHT / 2 + 4 * UNIT_SIZE);
    
        // Save/Load for Slot 1
        ctx.font = '30px serif';
        ctx.textAlign = 'left'
        ctx.rect(2 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Load Slot 1", 2 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.rect(7.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Save Slot 1", 7.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Save Slot 2 text border
        ctx.rect(xPositions[1], MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 4 + 1 * UNIT_SIZE, MAX_HEIGHT / 2 + 4 * UNIT_SIZE);

        // Save/Load for Slot 2
        ctx.textAlign = 'left'
        ctx.rect(MAX_WIDTH / 3 + 1 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Load Slot 2", MAX_WIDTH / 3 + 1 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.rect(MAX_WIDTH / 3 + 1 * UNIT_SIZE + 5.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Save Slot 2", MAX_WIDTH / 3 + 1 * UNIT_SIZE + 5.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Save Slot 3 text border
        ctx.rect(xPositions[2], MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 4 + 1 * UNIT_SIZE, MAX_HEIGHT / 2 + 4 * UNIT_SIZE);

        // Save/Load for Slot 3
        ctx.textAlign = 'left'
        ctx.rect(MAX_WIDTH * 2 / 3, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Load Slot 3", MAX_WIDTH * 2 / 3, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.rect(MAX_WIDTH * 2 / 3 + 5.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.fillText("  Save Slot 3", MAX_WIDTH * 2 / 3 + 5.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, 5.5 * UNIT_SIZE, 2 * UNIT_SIZE);

        ctx.stroke();
    };

    // Character Selection Screen
    function update_game_2() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears most of the canvas
        ctx.clearRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Character selection menu background color
        ctx.fillStyle = "beige";
        ctx.fillRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Character selection menu border
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);

        // Character selection menu text
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.fillText(" Character Selection ", MAX_WIDTH / 2, MAX_HEIGHT / 4 - 2 * UNIT_SIZE, 8 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Character selection menu text border
        ctx.rect(MAX_WIDTH / 2 - 4 * UNIT_SIZE, MAX_HEIGHT / 4 - 3.5 * UNIT_SIZE, 8 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Character slots
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Highschool Teen", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Male Highschool Teen"), 128, 64, 64, 64, 2 * UNIT_SIZE, MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    College Student", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Male College Student"), 128, 64, 64, 64, 2 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Impoverished   ", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Male Impoverished"), 128, 64, 64, 64, 2 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Spoiled Brat   ", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Male Spoiled Brat"), 128, 64, 64, 64, 2 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Elderly Person", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Male Elderly Person"), 128, 64, 64, 64, 2 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Highschool Teen", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Female Highschool Teen"), 128, 64, 64, 64, 2 * UNIT_SIZE, MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    College Student", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Female College Student"), 128, 64, 64, 64, 2 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Impoverished   ", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Female Impoverished"), 128, 64, 64, 64, 2 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Spoiled Brat   ", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Female Spoiled Brat"), 128, 64, 64, 64, 2 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, 256, 256);
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, MAX_HEIGHT / 5 + 4 * UNIT_SIZE);
        ctx.fillText("    Elderly Person ", MAX_WIDTH / 10 + 1.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, 2 * UNIT_SIZE);
        ctx.drawImage(document.getElementById("Female Elderly Person"), 128, 64, 64, 64, 2 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE), MAX_HEIGHT / 3 - 2.5 * UNIT_SIZE + TOP_BUFFER + MAX_HEIGHT / 5 + 4 * UNIT_SIZE, 256, 256);

        ctx.stroke();
    }

    // Game Menu pop_up
    function update_game_3() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears most of the canvas
        ctx.clearRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Load menu background color
        ctx.fillStyle = "beige";
        ctx.fillRect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Load menu border
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(UNIT_SIZE, UNIT_SIZE, MAX_WIDTH - 2 * UNIT_SIZE, MAX_HEIGHT + TOP_BUFFER - 2 * UNIT_SIZE);
        
        // Load menu top text
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.fillText(" COVID Crusher! ", MAX_WIDTH / 2, MAX_HEIGHT / 4 - 2 * UNIT_SIZE, 8 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Load menu text border
        ctx.rect(MAX_WIDTH / 2 - 4 * UNIT_SIZE, MAX_HEIGHT / 4 - 3.5 * UNIT_SIZE, 8 * UNIT_SIZE, 2 * UNIT_SIZE);

        // Instructions menu
        ctx.font = '60px serif';
        ctx.rect(2 * UNIT_SIZE + 0.5 * UNIT_SIZE, MAX_HEIGHT / 3 - 2 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, MAX_HEIGHT * 2 / 5 + 8 * UNIT_SIZE);
        ctx.fillText("    Instructions:  ", MAX_WIDTH / 10 + 2 * UNIT_SIZE, MAX_HEIGHT / 3 + 0.25 * UNIT_SIZE, MAX_WIDTH / 5, 3 * UNIT_SIZE);
        ctx.textAlign = "left";
        ctx.font = '48px serif';
        ctx.fillText("Use WASD or Arrow Keys to move and X to interact.", MAX_WIDTH / 10 + 0 * UNIT_SIZE, MAX_HEIGHT / 3 + 2 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.fillText("Use P or ESC to pause the game to save or load files.", MAX_WIDTH / 10 + 0 * UNIT_SIZE, MAX_HEIGHT / 3 + 4 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.fillText("Practice social distancing with any nearby players.", MAX_WIDTH / 10 + 0 * UNIT_SIZE, MAX_HEIGHT / 3 + 6 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.fillText("Try to reach 100 in strength, intelligence, or morale to", MAX_WIDTH / 10 + 0 * UNIT_SIZE, MAX_HEIGHT / 3 + 8 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.fillText("unlock the COVID-19 vaccine at the hospital to win!", MAX_WIDTH / 10 + 0 * UNIT_SIZE, MAX_HEIGHT / 3 + 10 * UNIT_SIZE, MAX_WIDTH - 5 * UNIT_SIZE, 4 * UNIT_SIZE);
        ctx.textAlign = "center";
        ctx.font = '42px serif';
        ctx.fillText("    Click anywhere to start...  ", MAX_WIDTH * 3 / 4 + 1.5 * UNIT_SIZE, MAX_HEIGHT / 2 + 9 * UNIT_SIZE, MAX_WIDTH / 5 - 1 * UNIT_SIZE, UNIT_SIZE / 3);
        
        ctx.stroke();
    }


    // Sprite drawer
    function draw_sprite(ctx, direction, sprite_sheet_type, player) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case UP:
                draw_animation(ctx, 1 + animation_stage, sprite_sheet, player);
                break;
            case DOWN:
                draw_animation(ctx, 6 + animation_stage, sprite_sheet, player);
                break;
            case LEFT:
                draw_animation(ctx, 11 + animation_stage, sprite_sheet, player);
                break;
            case RIGHT:
                draw_animation(ctx, 16 + animation_stage, sprite_sheet, player);
                break;
            default:
                break;
        }
        if (moves.length === 0) {
            animation_stage = 0
            animated = false;
        }
        if (animated) {
            if (animation_stage === 1) {
                animation_stage = 2;
            } else if (animation_stage === 2) {
                animation_stage = 3;
            } else if (animation_stage === 3) {
                animation_stage = 4;
            } else {
                animation_stage = 1;
            }
        }
    }

    // For draw_sprite()
    function draw_animation(ctx, sprite_no, sprite_sheet, sprite) {
        switch(sprite_no) {
            // Up
            case 1:
                ctx.drawImage(sprite_sheet, 0, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 2:
                ctx.drawImage(sprite_sheet, 128, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER - 4, 64, 64);
                break;
            case 3:
                ctx.drawImage(sprite_sheet, 0, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER - 8, 64, 64);
                break;
            case 4:
                ctx.drawImage(sprite_sheet, 64, 192, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER + 8, 64, 64);
                break;
            case 5:
                ctx.drawImage(sprite_sheet, 0, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER + 4, 64, 64);
                break;
            // Down
            case 6:
                ctx.drawImage(sprite_sheet, 128, 64, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 7:
                ctx.drawImage(sprite_sheet, 128, 192, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER + 4, 64, 64);
                break;
            case 8:
                ctx.drawImage(sprite_sheet, 128, 64, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER + 8, 64, 64);
                break;
            case 9:
                ctx.drawImage(sprite_sheet, 128, 128, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER - 8, 64, 64);
                break;
            case 10:
                ctx.drawImage(sprite_sheet, 128, 64, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER - 4, 64, 64);
                break;
            // Left
            case 11:
                ctx.drawImage(sprite_sheet, 0, 128, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 12:
                ctx.drawImage(sprite_sheet, 0, 64, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 - 4, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 13:
                ctx.drawImage(sprite_sheet, 0, 128, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 - 8, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 14:
                ctx.drawImage(sprite_sheet, 0, 192, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 + 8, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 15:
                ctx.drawImage(sprite_sheet, 0, 128, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 + 4, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            // Right
            case 16:
                ctx.drawImage(sprite_sheet, 64, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 17:
                ctx.drawImage(sprite_sheet, 64, 128, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 + 4, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 18:
                ctx.drawImage(sprite_sheet, 64, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 + 8, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 19:
                ctx.drawImage(sprite_sheet, 64, 64, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 - 8, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
            case 20:
                ctx.drawImage(sprite_sheet, 64, 0, 64, 64, sprite.get_x_pos() * UNIT_SIZE - UNIT_SIZE / 2 - 4, sprite.get_y_pos() * UNIT_SIZE - UNIT_SIZE + TOP_BUFFER, 64, 64);
                break;
        }
    }

    // Draw NPC
    function draw_sprite_npc(ctx, direction, sprite_sheet_type, player) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case UP:
                draw_animation(ctx, 1 + animation_stage_npc, sprite_sheet, player);
                break;
            case DOWN:
                draw_animation(ctx, 6 + animation_stage_npc, sprite_sheet, player);
                break;
            case LEFT:
                draw_animation(ctx, 11 + animation_stage_npc, sprite_sheet, player);
                break;
            case RIGHT:
                draw_animation(ctx, 16 + animation_stage_npc, sprite_sheet, player);
                break;
            default:
                break;
        }

        if (move_directions.length === 0) {
            animation_stage_npc = 0
            is_animated = false;
        }

        if (is_animated) {
            if (animation_stage_npc === 1) {
                animation_stage_npc = 2;
            } else if (animation_stage_npc === 2) {
                animation_stage_npc = 3;
            } else if (animation_stage_npc === 3) {
                animation_stage_npc = 4;
            } else {
                animation_stage_npc = 1;
            }
        }
    }
    
    function draw_sprite_npc2(ctx, direction, sprite_sheet_type, player) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case UP:
                draw_animation(ctx, 1 + animation_stage_npc2, sprite_sheet, player);
                break;
            case DOWN:
                draw_animation(ctx, 6 + animation_stage_npc2, sprite_sheet, player);
                break;
            case LEFT:
                draw_animation(ctx, 11 + animation_stage_npc2, sprite_sheet, player);
                break;
            case RIGHT:
                draw_animation(ctx, 16 + animation_stage_npc2, sprite_sheet, player);
                break;
            default:
                break;
        }

        if (move_directions2.length === 0) {
            animation_stage_npc2 = 0
            is_animated2 = false;
        }

        if (is_animated2) {
            if (animation_stage_npc2 === 1) {
                animation_stage_npc2 = 2;
            } else if (animation_stage_npc2 === 2) {
                animation_stage_npc2 = 3;
            } else if (animation_stage_npc2 === 3) {
                animation_stage_npc2 = 4;
            } else {
                animation_stage_npc2 = 1;
            }
        }
    }

    function draw_sprite_npc3(ctx, direction, sprite_sheet_type, player) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case UP:
                draw_animation(ctx, 1 + animation_stage_npc3, sprite_sheet, player);
                break;
            case DOWN:
                draw_animation(ctx, 6 + animation_stage_npc3, sprite_sheet, player);
                break;
            case LEFT:
                draw_animation(ctx, 11 + animation_stage_npc3, sprite_sheet, player);
                break;
            case RIGHT:
                draw_animation(ctx, 16 + animation_stage_npc3, sprite_sheet, player);
                break;
            default:
                break;
        }

        if (move_directions3.length === 0) {
            animation_stage_npc3 = 0
            is_animated3 = false;
        }

        if (is_animated3) {
            if (animation_stage_npc3 === 1) {
                animation_stage_npc3 = 2;
            } else if (animation_stage_npc3 === 2) {
                animation_stage_npc3 = 3;
            } else if (animation_stage_npc3 === 3) {
                animation_stage_npc3 = 4;
            } else {
                animation_stage_npc3 = 1;
            }
        }
    }

    function draw_sprite_npc4(ctx, direction, sprite_sheet_type, player) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case UP:
                draw_animation(ctx, 1 + animation_stage_npc4, sprite_sheet, player);
                break;
            case DOWN:
                draw_animation(ctx, 6 + animation_stage_npc4, sprite_sheet, player);
                break;
            case LEFT:
                draw_animation(ctx, 11 + animation_stage_npc4, sprite_sheet, player);
                break;
            case RIGHT:
                draw_animation(ctx, 16 + animation_stage_npc4, sprite_sheet, player);
                break;
            default:
                break;
        }

        if (move_directions4.length === 0) {
            animation_stage_npc4 = 0
            is_animated4 = false;
        }

        if (is_animated4) {
            if (animation_stage_npc4 === 1) {
                animation_stage_npc4 = 2;
            } else if (animation_stage_npc4 === 2) {
                animation_stage_npc4 = 3;
            } else if (animation_stage_npc4 === 3) {
                animation_stage_npc4 = 4;
            } else {
                animation_stage_npc4 = 1;
            }
        }
    }

    // To increment in-game time
    function pass_time(time_passed) {
        time = (time + time_passed) % 24;
        player.delta_substenance = - (10 - player._morale / 100) * time_passed;
    };

    // Keyboard inputs
    document.onkeydown = function(e) {
        var movequeue = moves;
        if (moves.length >= 1) {
            return;
        }
        e.preventDefault();
        switch(e.which) {
            case 37: // Left
            case 65: // A
                if(play) {
                    movequeue.push(0); // move(LEFT);
                }
                break;
            case 39: // Right
            case 68: // D
                if(play) {
                    movequeue.push(1); // move(RIGHT);
                }
                break;
            case 38: // up
            case 87: // W
                if(play) {
                    movequeue.push(2); // move(UP);
                }
                break;
            case 40: // Down
            case 83: // S
                if(play) {
                    movequeue.push(3); // move(DOWN);
                }
                break;
            // case 32: // Space
            case 70: // F
            case 88: // X
                if(play) {
                    // interact();
                    if (WORLD_MAP[player.y_pos][player.x_pos] === 2) {
                        movequeue.push(4);
                        play_interact_audio();
                    }
                }
                break;
            case 27: // ESC
            case 80: // P
                if (game_state === 0) {
                    setGameState(1);
                    setPlay(false);
                } else {
                    setGameState(0);
                    if (!play) {
                        setPlay(true);
                    }
                }
                break;
            case 67: // C
                break;
                if (setup) {
                    if (game_state === 2) {
                        setGameState(0);
                        setPlay(true);
                    } else {
                        setGameState(2);
                        setPlay(false);
                    }
                }
                break;
            case 86: // V
                break;
                if (setup) {
                    if (game_state === 3) {
                        setGameState(0);
                        setPlay(true);
                    } else {
                        setGameState(3);
                        setPlay(false);
                    }
                }
                break;
            default: 
                return; // exit this handler for other keys
        }
        setMoves(movequeue);
    };

    async function on_click(e) {
        let canvas = document.getElementById("game-canvas");
        let x = e.pageX - canvas.getBoundingClientRect().left;
        let y = e.pageY - canvas.getBoundingClientRect().top;
        switch (game_state) {
            case 0:
                break;
            case 1:
                // Get data for each of the save slots
                gameSaves = await getSavedSlots()
                const saveSlots = gameSaves

                if (x > 2 * UNIT_SIZE && x < 2 * UNIT_SIZE + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    loadSlot(1, saveSlots[1] ?? null)
                } else if (x > 7.5 * UNIT_SIZE && x < 7.5 * UNIT_SIZE + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    saveToSlot(1, saveSlots[1] ?? null)
                } else if (x > MAX_WIDTH / 3 + 1 * UNIT_SIZE && x < MAX_WIDTH / 3 + 1 * UNIT_SIZE + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    loadSlot(2, saveSlots[2] ?? null);
                } else if (x > MAX_WIDTH / 3 + 1 * UNIT_SIZE + 5.5 * UNIT_SIZE && x < MAX_WIDTH / 3 + 1 * UNIT_SIZE + 5.5 * UNIT_SIZE + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    saveToSlot(2, saveSlots[2] ?? null);
                } else if (x > MAX_WIDTH * 2 / 3 && x < MAX_WIDTH * 2 / 3 + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    loadSlot(3, saveSlots[3] ?? null)
                } else if (x > MAX_WIDTH * 2 / 3 + 5.5 * UNIT_SIZE && x < MAX_WIDTH * 2 / 3 + 5.5 * UNIT_SIZE + 5.5 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * UNIT_SIZE + 1 * UNIT_SIZE) {
                    saveToSlot(3, saveSlots[3] ?? null);
                };
                break;
            case 2:
                console.log(e);
                console.log(x, y);
                function start_game() {
                    swal("Confirm selection:", "Are you sure about your character class? (This action cannot be undone.)", "info", {
                        buttons: {
                          leave: {
                            text: "Not sure...",
                            value: "leave",
                          },
                          enter: {
                            text: "Let's start!",
                            value: "enter",
                          },
                        }
                    }).then((value)=>{
                        switch (value) {
                            case "leave":
                                swal("OK, take your time.");
                                break;
                            case "enter":
                                swal("Let's go!", "Starting game...", "success").then(() => {
                                    setGameState(0);
                                    setPlay(true);
                                });
                                break;
                            default:
                                swal("Leave")
                                break;
                        }
                    });
                };
                if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(0);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(1);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(2);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(3);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(4);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(5);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(6);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(7);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(8);
                } else if (x > 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) && x < 2 * UNIT_SIZE + 0.5 * UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * UNIT_SIZE) + MAX_WIDTH / 5 - 1 * UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE + MAX_HEIGHT / 5 + 4 * UNIT_SIZE) {
                    character_selection(9);
                };
                start_game();
                break;
            case 3:
                swal("Alright!", "Let's select your character...").then(()=>{
                    setGameState(2);
                });
                break;
            default:
                break;
        }
    };

    // Used for dealing with Google OAuth
    async function onSignIn(googleUser) {
        // Modify the global variable
        email = googleUser.getBasicProfile().getEmail()
        gameSaves = await getSavedSlots()
    }

    function formatTime(time) {
        return `${Math.trunc(time).toString().padStart(2, "0")}:${Math.trunc((time - Math.trunc(time)) * 60).toString().padStart(2, "0")}`
    }

    return (
        <table id="game-table" style={{border: "none"}}>
        <tr>
          <td id="left-column" style={{ textAlign: 'left', paddingLeft: '10px', backgroundColor: "Beige", border: "none" }}>
            <p>
              <b>Stats:</b>
            </p>
            <p>???? Time: {formatTime(time)}</p>
            <p>?????? Health points: {player._hp}</p>
            <p>???? Sustenance: {Math.trunc(player._substenance)}</p>
            <p>???? Cash: ${player._cash}</p>
            <p>???? Strength: {player._strength}</p>
            <p>???? Intelligence: {player._intelligence}</p>
            <p>???? Morale: {player._morale}</p>
            <p>???? Character: {player._type}</p>
            <p>?????? Email: {email === '' ? "Not signed in" : email}</p>
            
            {/* <p>{player.x_pos}, {player.y_pos}</p> */}

            {/* Display OAuth 2.0 login */}
            <p style={{ paddingTop: "20px", }}><b>Sign in:</b></p>
            <GoogleLogin
              clientID="130407574445-7d1gjhpe6u5pj04fe4794hmbq7mtl9c1.apps.googleusercontent.com"
              buttonText="Sign in"
              onSuccess={onSignIn}
              onFailure={onSignIn}
              cookiePolicy={'single_host_origin'}
            />

                    {/* Hidden elements for special effects */}
                    <audio controls id="background_audio" src="/audio/twinleaf_town.wav" style={{display: 'none'}}> Your browser does not support the <code>audio</code> element. </audio>
                    <audio controls id="item_received_audio" src="/audio/item_received.mp3" style={{display: 'none'}} onEnded={resume_background}> Your browser does not support the <code>audio</code> element. </audio>
                    <audio controls id="item_consumed_audio" src="/audio/item_consumed.mp3" style={{display: 'none'}} onEnded={resume_background}> Your browser does not support the <code>audio</code> element. </audio>
                    <audio controls id="sleeping_audio" src="/audio/sleeping.mp3" style={{display: 'none'}} onEnded={resume_background}> Your browser does not support the <code>audio</code> element. </audio>
                    <audio controls id="wall_bump_audio" src="/audio/wall_bump.mp3" style={{display: 'none'}}> Your browser does not support the <code>audio</code> element. </audio>
                    <audio controls id="interact_audio" src="/audio/interact.mp3" style={{display: 'none'}}> Your browser does not support the <code>audio</code> element. </audio>
                    <img src="images/sprite_sheets/Aaron.png" alt="Aaron" id="Male Highschool Teen" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Lucian.png" alt="Lucian" id="Male College Student" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Roark.png" alt="Roark" id="Male Impoverished" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Flint.png" alt="Flint" id="Male Spoiled Brat" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Byron.png" alt="Byron" id="Male Elderly Person" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Maylene.png" alt="Maylene" id="Female Highschool Teen" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Cynthia.png" alt="Cynthia" id="Female College Student" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Gardenia.png" alt="Gardenia" id="Female Impoverished" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Candice.png" alt="Candice" id="Female Spoiled Brat" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Bertha.png" alt="Bertha" id="Female Elderly Person" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Dawn.png" alt="Smol" id="Smol" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Fantina.png" alt="Fantina" id="NPC1" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Palmer.png" alt="Palmer" id="NPC2" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Volkner.png" alt="Volkner" id="NPC3" style={{display: 'none'}}></img>
                    <img src="images/sprite_sheets/Wake.png" alt="Wake" id="NPC4" style={{display: 'none'}}></img>
                    {/* Top row buildings */}
                    <img src="/images/environment/dirt_path.png" alt="Dirt Path" id="dirt-path" style={{display: 'none'}}></img>
                    <img src="/images/environment/grass.png" alt="Grass" id="grass" style={{display: 'none'}}></img>
                    <img src="/images/environment/tree_2.png" alt="Tree 2" id="tree-2" style={{display: 'none'}}></img>
                    <img src="/images/buildings/homes/apartment.png" alt="apartment" id="apartment" style={{display: 'none'}}></img>
                    <img src="/images/buildings/homes/house.png" alt="house" id="house" style={{display: 'none'}}></img>
                    <img src="/images/buildings/homes/villa.png" alt="villa" id="villa" style={{display: 'none'}}></img>
                    <img src="/images/buildings/neighbor.png" alt="neighbor" id="neighbor" style={{display: 'none'}}></img>
                    <img src="/images/buildings/city_hall.png" alt="City Hall" id="city-hall" style={{display: 'none'}}></img>
                    <img src="/images/buildings/store1.png" alt="Unary Store" id="store-1" style={{display: 'none'}}></img>
                    <img src="/images/buildings/store2.png" alt="Binary Store" id="store-2" style={{display: 'none'}}></img>
                    <img src="/images/buildings/store3.png" alt="Ternary Store" id="store-3" style={{display: 'none'}}></img>
                    <img src="/images/buildings/store4.png" alt="Mystery Store" id="store-4" style={{display: 'none'}}></img>
                    <img src="/images/environment/tree.png" alt="Tree" id="tree-1" style={{display: 'none'}}></img>
                    {/* Row two buildings */}
                    <img src="/images/environment/park.png" alt="Park" id="park" style={{display: 'none'}}></img>
                    <img src="/images/buildings/object_garden.png" alt="Object Garden" id="object-garden" style={{display: 'none'}}></img>
                    <img src="/images/buildings/cin_n_cout.png" alt="Cin-N-Cout" id="cin-n-cout" style={{display: 'none'}}></img>
                    <img src="/images/buildings/foobar.png" alt="Foobar" id="foobar" style={{display: 'none'}}></img>
                    <img src="/images/buildings/casino.png" alt="Casino" id="casino" style={{display: 'none'}}></img>
                    {/* Row Three buildings (Just the library) */}
                    <img src="/images/buildings/library.png" alt="Library" id="library" style={{display: 'none'}}></img>
                    {/* Row Four buildings (Just the park one) */}
                    {/* We have no park building yet... */}
                    {/* Row Five buildings (NOT COLLEGE) */}
                    <img src="/images/buildings/highschool.png" alt="Highschool" id="highschool" style={{display: 'none'}}></img>
                    <img src="/images/buildings/work.png" alt="Work" id="work" style={{display: 'none'}}></img>
                    <img src="/images/buildings/gym.png" alt="Gym" id="gym" style={{display: 'none'}}></img>
                    <img src="/images/buildings/hospital.png" alt="Hospital" id="hospital" style={{display: 'none'}}></img>
                    {/* Row Six building (College has different left side than others) */}
                    <img src="/images/buildings/college.png" alt="College" id="college" style={{display: 'none'}}></img>
                    <img src="/images/buildings/college2.png" alt="College without doormat" id="college-without-doormat" style={{display: 'none'}}></img>
                    <img src="/images/buildings/college_doormat.png" alt="College Doormat" id="college-doormat" style={{display: 'none'}}></img>
                </td>
                <td id="center-column">
                    <canvas ref={canvasRef} width={MAX_WIDTH} height={MAX_HEIGHT + TOP_BUFFER} id="game-canvas" onClick={(e) => {on_click(e)}}/>
                </td>
                <td id="right-column" style={{ backgroundColor: "beige", border: "none", paddingLeft: "10px" }}>
                    <h1 style={{ textAlign: "center" }}> Inventory:</h1>
                    <table id="inventory" style={{width: "90%", paddingLeft: "10px" }}>
                        <tr id="inventory">
                            {/* player._inventory.use_item.bind(this, item_index, player) */}
                            {player._inventory._item_array.slice(0, 3).map((item, item_index) => {
                                return (<td onClick={player._inventory.use_item.bind(this, item_index, player)}><img src={`/images/items/${item._item_type}.jpg`}></img></td>);
                            })}
                            {(() => {
                                let empty = (new Array(Math.max(0, 3 - player._inventory._item_array.length))).fill("Empty");
                                return (<React.Fragment>
                                            {empty.map((item) => <td><img src={`/images/items/${item}.jpg`}></img></td>)}
                                        </React.Fragment>);
                            })()}
                        </tr>
                        <tr id="inventory">
                            {player._inventory._item_array.slice(3, 6).map((item, item_index) => {
                                return (<td onClick={player._inventory.use_item.bind(this, item_index + 3, player)}><img src={`/images/items/${item._item_type}.jpg`}></img></td>);
                            })}
                            {(() => {
                                let empty = (new Array(Math.max(0, 3 - player._inventory._item_array.slice(3, 6).length))).fill("Empty");
                                return (<React.Fragment>
                                            {empty.map((item) => <td><img src={`/images/items/${item}.jpg`}></img></td>)}
                                        </React.Fragment>);
                            })()}
                        </tr>
                        <tr id="inventory">
                            {player._inventory._item_array.slice(6, 9).map((item, item_index) => {
                                return (<td onClick={player._inventory.use_item.bind(this, item_index + 6, player)}><img src={`/images/items/${item._item_type}.jpg`}></img></td>);
                            })}
                            {(() => {
                                let empty = (new Array(Math.max(0, 3 - player._inventory._item_array.slice(6, 9).length))).fill("Empty");
                                return (<React.Fragment>
                                            {empty.map((item) => <td><img src={`/images/items/${item}.jpg`}></img></td>)}
                                        </React.Fragment>);
                            })()}
                        </tr>
                        <tr>
                            {player._inventory._item_array.slice(9, 12).map((item, item_index) => {
                                return (<td onClick={player._inventory.use_item.bind(this, item_index + 9, player)}><img src={`/images/items/${item._item_type}.jpg`}></img></td>);
                            })}
                            {(() => {
                                let empty = (new Array(Math.max(0, 3 - player._inventory._item_array.slice(9, 12).length))).fill("Empty");
                                return (<React.Fragment>
                                            {empty.map((item) => <td><img src={`/images/items/${item}.jpg`}></img></td>)}
                                        </React.Fragment>);
                            })()}
                        </tr>
                        <tr>
                            {player._inventory._item_array.slice(12, 15).map((item, item_index) => {
                                return (<td onClick={player._inventory.use_item.bind(this, item_index + 12, player)}><img src={`/images/items/${item._item_type}.jpg`}></img></td>);
                            })}
                            {(() => {
                                let empty = (new Array(Math.max(0, 3 - player._inventory._item_array.slice(12, 15).length))).fill("Empty");
                                return (<React.Fragment>
                                            {empty.map((item) => <td><img src={`/images/items/${item}.jpg`}></img></td>)}
                                        </React.Fragment>);
                            })()}
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    );
};

function resume_background() {
    let background_audio = document.getElementById("background_audio");
    background_audio.volume = 0.025;
    background_audio.play();
}

function play_item_received_audio() {
    let background_audio = document.getElementById("background_audio");
    background_audio.pause();
    let item_audio = document.getElementById("item_received_audio");
    item_audio.volume = 0.025;
    item_audio.play();
};

export function play_item_consumed_audio() {
    let background_audio = document.getElementById("background_audio");
    background_audio.pause();
    let item_audio = document.getElementById("item_consumed_audio");
    item_audio.volume = 0.025;
    item_audio.play();
};

function play_sleeping_audio() {
    let background_audio = document.getElementById("background_audio");
    background_audio.pause();
    let item_audio = document.getElementById("sleeping_audio");
    item_audio.volume = 0.025;
    item_audio.play();
};

function play_wall_bump_audio() {
    let item_audio = document.getElementById("wall_bump_audio");
    item_audio.volume = 0.1;
    item_audio.play();
};

function play_interact_audio() {
    let item_audio = document.getElementById("interact_audio");
    item_audio.volume = 0.1;
    item_audio.play();
};

// Get all saved slots for the user as a JS object
async function getSavedSlots() {
    const slots = (await axios.get('/save', { params: { email }})).data

    // Convert slots, which is an array, to an object
    const slotObj = {}
    for (const save of slots) slotObj[save.slot] = save

    return slotObj
}

function saveToSlot(num, slotData) {
    if (email === '') return swal("You must sign in before you can save to a slot!")

    // No game exists on slot
    if (slotData == null) {
        saveGameState(num)
        swal(`Saved Slot ${num}!`);
    }
    else {
        swal("Confirm selection", `Overriding save on slot ${num}`, 'info', {
            buttons: {
                leave: {
                    text: "No, don't override the save!",
                    value: "leave",
                },
                enter: {
                    text: `Override save on slot ${num}`,
                    value: "enter",
                }
            }
        }).then((value) => {
            if (value == "enter") { 
                saveGameState(num)
                swal(`Saved Slot ${num}!`)
            }
        })
    }
}

// Two possibilities: either there is already a save for this slot or isn't
function loadSlot(num, slotData) {
    // User is not logged in
    if (email === '') return swal("You must sign in before you can load a save!")

    // Game already exists on this slot
    if (slotData != null) {
        swal("Confirm selection", `Switching to game on slot ${num}`, 'info', {
            buttons: {
                leave: {
                    text: "No, stay on this game!",
                    value: "leave",
                },
                enter: {
                    text: `Switch to slot ${num}`,
                    value: "enter",
                }
            }
        }).then((value) => {
            if (value == "enter") { 
                // 1. Save current game to current slot
                // saveGameState(player._slot)

                // 2. Change game state to that of chosen slot
                setGameState(slotData)
                swal(`Switched to slot ${num}`)
            }
            else swal(`Staying on current slot (${num})`)
        })
    }
    else {
        swal("Confirm selection:", `Are you sure you want to start a new game on slot ${num}?`, "info", {
            buttons: {
                leave: {
                    text: "No, stay on this game!",
                    value: "leave",
                },
                enter: {
                    text: "New game!",
                    value: "enter",
                }
            }
        }).then((value) => {
            if (value === "leave") swal("OK, staying on this game!")
            else { 
                swal(`OK, starting a new game on slot ${num}!`)
                // TO-DO: resetGameState() should probably let them pick the character lol?
                resetGameState()
                saveGameState(num)
            }
        })
    }
}

function resetGameState() {
    player = new playerModule.Role(2, 5, 100, 200, 50, 69, 50, 'Female College Student');
    time = 6
}

// Change player state to the state in slot data
function setPlayerState(slotData) {
    console.log(player.playerState());
    player._slot = slotData.slot;
    player.x_pos = slotData.position.x;
    player.y_pos = slotData.position.y;
    player._type = slotData.playerType;
    player.direction = slotData.direction;
    player._intelligence = slotData.stats.intelligence;
    player._strength = slotData.stats.strength;
    player._morale = slotData.stats.morale;
    player._substenance = slotData.stats.sustenance; // Note: Sustenance is spelled wrong here
    player._hp = slotData.stats.health;
    player._cash = slotData.money;
    player._inventory._item_array = slotData.inventory.items;

    const len = player._inventory._item_array.length
    for (let x = 0; x < len; x++) {
        const itemType = player._inventory._item_array[x]
        player._inventory.item_array[x] = itemsModule[itemType]
    }
    player._inventory._capacity = slotData.inventory.capacity;
    // console.log(player.playerState());
};

// Set all values to those that were in the save
async function setGameState(slotData) {
    setPlayerState(slotData)

    // Modify global game state
    time = slotData.time
    gameSaves = await getSavedSlots()
}

// Sends the game state to the backend
async function saveGameState(specifiedSlot) {
    const gameState = getGameState()
    // Save for a specific slot, otherwise current slot
    if (specifiedSlot != null) gameState.slot = specifiedSlot
    gameState.email = email

    await axios.post('/save', gameState)
    gameSaves = await getSavedSlots()
}

// Gets the full state of the game
function getGameState() {
    // TO-DO: Pass in username as well
   const gameState = player.playerState()
   gameState.time = time

   return gameState
}

export default COVID_SMASHER;
