import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import './covid_smasher.css';

import * as locations_module from './base_classes/locations.js'
import * as timezones_module from './base_classes/timezones.js'
import * as player_module from './base_classes/player.js'

// var player = new player_module.player(2, 5);
var player = new player_module.Role(2, 5, 100, 200, 50, 69, 50, 'FemaleCollegeStudent');
var animated = false;
var animation_stage = 0;

function character_selection(player_class) {
    switch (player_class) {
        case 0:
            // player = m_highschool_teen;
            break;
        case 1:
            // player = m_college_student;
            break;
        case 2:
            // player = m_rich_kid;
            break;
        case 3:
            // player = m_poor_person;
            break;
        case 4:
            // player = m_old_person;
            break;
        case 5:
            // player = f_highschool_teen;
            break;
        case 6:
            // player = f_college_student;
            break;
        case 7:
            // player = f_rich_kid;
            break;
        case 8:
            // player = f_poor_person;
            break;
        case 9:
            // player = f_old_person;
            break;
        default:
            break;
    }
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
    // Use 24hr clock, for easy modding, for in game time
    const [time, setTime] = useState(0);
    // Movequeue for storing keyboard inputs
    const [moves, setMoves] = useState([]);
    // Game state
    const [game_state, setGameState] = useState(2);
    // Setup
    const [setup, setSetup] = useState(true);
    
    // Initializes display screen
    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
    }, []);

    // Game Clock
    useEffect(()=>{
        setTimeout(counter, 150);
    }, [ticks]);

    // Game Clock
    function counter () {
        switch (game_state) {
            case 0: // WORLD MAP
                update_game_0();
                break;
            case 1: // PAUSE MENU
                update_game_1();
                break;
            case 2: // CHARACTER SELECTION SCREEN
                update_game_2();
                break;
            default:
                update_game_0();
                setGameState(0);
                break;
        }
        setTicks(ticks + 1)
    }

    // WORLD MAP
    function update_game_0 () {
        let movequeue = moves;
        if (moves.length > 0 && ticks % 2 === 0) {
            switch (movequeue[0]) {
                case 0:
                    if (player.direction === locations_module.DIRECTION.LEFT && player.x_pos > 0 && (locations_module.WORLD_MAP[player.y_pos][player.x_pos - 1] === 0 || locations_module.WORLD_MAP[player.y_pos][player.x_pos - 1] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 1:
                    if (player.direction === locations_module.DIRECTION.RIGHT && player.x_pos < locations_module.WORLD_WIDTH - 1 && (locations_module.WORLD_MAP[player.y_pos][player.x_pos + 1] === 0 || locations_module.WORLD_MAP[player.y_pos][player.x_pos + 1] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 2:
                    if (player.direction === locations_module.DIRECTION.UP && player.y_pos > 0 && (locations_module.WORLD_MAP[player.y_pos - 1][player.x_pos] === 0 || locations_module.WORLD_MAP[player.y_pos - 1][player.x_pos] === 2)) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 3:
                    if (player.direction === locations_module.DIRECTION.DOWN && player.y_pos < locations_module.WORLD_HEIGHT - 1 && (locations_module.WORLD_MAP[player.y_pos + 1][player.x_pos] === 0 || locations_module.WORLD_MAP[player.y_pos + 1][player.x_pos] === 2)) {
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
        ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT + locations_module.TOP_BUFFER);

        // Shadow of the buildings
        ctx.fillStyle = "blue";
        ctx.fillRect(0 *  locations_module.UNIT_SIZE, 0 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 40 * locations_module.UNIT_SIZE, 4 * locations_module.UNIT_SIZE);
        ctx.fillRect(0 *  locations_module.UNIT_SIZE, 8 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 5 * locations_module.UNIT_SIZE, 5 * locations_module.UNIT_SIZE);
        ctx.fillRect(9 *  locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 10 * locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE);
        ctx.fillRect(22 *  locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 18 * locations_module.UNIT_SIZE, 4 * locations_module.UNIT_SIZE);
        ctx.fillRect(0 *  locations_module.UNIT_SIZE, 16 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 7 * locations_module.UNIT_SIZE, 8 * locations_module.UNIT_SIZE);
        ctx.fillRect(12 *  locations_module.UNIT_SIZE, 17 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 13 * locations_module.UNIT_SIZE, 4 * locations_module.UNIT_SIZE);
        ctx.fillRect(25 *  locations_module.UNIT_SIZE, 17 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 15 * locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE);
        
        // Environmental Assets
        let dirt_path = document.getElementById("dirt-path");
        ctx.drawImage(dirt_path, 0, 0 + locations_module.TOP_BUFFER, locations_module.WORLD_WIDTH * locations_module.UNIT_SIZE, locations_module.WORLD_HEIGHT * locations_module.UNIT_SIZE);

        let tree_2 = document.getElementById("tree-2");
        let total_pixel_width = locations_module.WORLD_WIDTH * locations_module.UNIT_SIZE
        for (let i = -locations_module.UNIT_SIZE; i < total_pixel_width; i+=32) {
            ctx.drawImage(tree_2, i, -70 + locations_module.TOP_BUFFER);
            ctx.drawImage(tree_2, i, -60 + locations_module.TOP_BUFFER);
            ctx.drawImage(tree_2, i, -50 + locations_module.TOP_BUFFER);
            ctx.drawImage(tree_2, i, -40 + locations_module.TOP_BUFFER);
            ctx.drawImage(tree_2, i, -30 + locations_module.TOP_BUFFER);
        }


        // Buildings
        let home = document.getElementById("home");
        ctx.drawImage(home, 0, -48 + locations_module.TOP_BUFFER);

        let neighbor = document.getElementById("neighbor");
        ctx.drawImage(neighbor, 128, -24 + locations_module.TOP_BUFFER);

        let city_hall = document.getElementById("city-hall");
        ctx.drawImage(city_hall, 256, -56 + locations_module.TOP_BUFFER);

        let store_1 = document.getElementById("store-1");
        ctx.drawImage(store_1, 496, -12 + locations_module.TOP_BUFFER);

        let store_2 = document.getElementById("store-2");
        ctx.drawImage(store_2, 666, -8 + locations_module.TOP_BUFFER);

        let store_3 = document.getElementById("store-3");
        ctx.drawImage(store_3, 832, -4 + locations_module.TOP_BUFFER);

        let store_4 = document.getElementById("store-4");
        ctx.drawImage(store_4, 983, 8 + locations_module.TOP_BUFFER);

        let tree_1 = document.getElementById("tree-1");
        ctx.drawImage(tree_1, 1152, 32 + locations_module.TOP_BUFFER);

        // Row 2
        let library = document.getElementById("library");
        ctx.drawImage(library, -4, 256 + locations_module.TOP_BUFFER);

        let park = document.getElementById("park");
        ctx.drawImage(park, 288, 224 + locations_module.TOP_BUFFER);

        let object_garden = document.getElementById("object-garden");
        ctx.drawImage(object_garden, 708, 232 + locations_module.TOP_BUFFER);

        let cin_n_cout = document.getElementById("cin-n-cout");
        ctx.drawImage(cin_n_cout, 840, 224 + locations_module.TOP_BUFFER);

        let foobar = document.getElementById("foobar");
        ctx.drawImage(foobar, 984, 225 + locations_module.TOP_BUFFER);

        let casino = document.getElementById("casino");
        ctx.drawImage(casino, 1128, 220 + locations_module.TOP_BUFFER);

        // Row 3
        let highschool = document.getElementById("highschool");
        ctx.drawImage(highschool, -3, 500 + locations_module.TOP_BUFFER);

        let work = document.getElementById("work");
        ctx.drawImage(work, 384, 550 + locations_module.TOP_BUFFER);

        let gym = document.getElementById("gym");
        ctx.drawImage(gym, 524, 524 + locations_module.TOP_BUFFER);

        let hospital = document.getElementById("hospital");
        ctx.drawImage(hospital, 666, 543 + locations_module.TOP_BUFFER, 128, 128);

        let college = document.getElementById("college");
        ctx.drawImage(college, 768, 456 + locations_module.TOP_BUFFER);

        // Draw player
        draw_sprite(ctx, player.direction, player._type);
        
        
        if (moves.length > 0 && ticks % 2 === 0) {
            switch (movequeue[0]) {
                case 0:
                    if (player.direction === locations_module.DIRECTION.LEFT) {
                        player.move_left();
                    } else {
                        player.set_direction(locations_module.DIRECTION.LEFT);
                    };
                    break;
                case 1:
                    if (player.direction === locations_module.DIRECTION.RIGHT) {
                        player.move_right();
                    } else {
                        player.set_direction(locations_module.DIRECTION.RIGHT);
                    };
                    break;
                case 2:
                    if (player.direction === locations_module.DIRECTION.UP) {
                        player.move_up();
                    } else {
                        player.set_direction(locations_module.DIRECTION.UP);
                    };
                    break;
                case 3:
                    if (player.direction === locations_module.DIRECTION.DOWN) {
                        player.move_down();
                    } else {
                        player.set_direction(locations_module.DIRECTION.DOWN);
                    };
                    break;
                case 4:
                    if (locations_module.WORLD_MAP[player.y_pos][player.x_pos] === 2) {
                        if (player.x_pos === 1 && player.y_pos === 4) {
                            alert("Arrived home!");
                        } else if (player.x_pos === 2 && player.y_pos === 4) {
                            alert("Arrived home!");
                        } else if (player.x_pos === 5 && player.y_pos === 4) {
                            alert("Arrived at Neighbor's house!");
                        } else if (player.x_pos === 12 && player.y_pos === 4) {
                            alert("Arrived at City Hall!");
                        } else if (player.x_pos === 17 && player.y_pos === 4) {
                            alert("Arrived at Store 1!");
                        } else if (player.x_pos === 23 && player.y_pos === 4) {
                            alert("Arrived at Store 2!");
                        } else if (player.x_pos === 28 && player.y_pos === 4) {
                            alert("Arrived at Store 3!");
                        } else if (player.x_pos === 33 && player.y_pos === 4) {
                            alert("Arrived at Store 4!");
                        } else if (player.x_pos === 2 && player.y_pos === 13) {
                            alert("Arrived at Library!");
                        } else if (player.x_pos === 23 && player.y_pos === 11) {
                            alert("Arrived at Object Garden!");
                        } else if (player.x_pos === 27 && player.y_pos === 11) {
                            alert("Arrived at Cin-n-cout!");
                        } else if (player.x_pos === 28 && player.y_pos === 11) {
                            alert("Arrived at Cin-n-cout!");
                        } else if (player.x_pos === 29 && player.y_pos === 11) {
                            alert("Arrived at Cin-n-cout!");
                        } else if (player.x_pos === 32 && player.y_pos === 11) {
                            alert("Arrived at Foobar!");
                        } else if (player.x_pos === 37 && player.y_pos === 11) {
                            alert("Arrived at Game Corner!");
                        } else if (player.x_pos === 7 && player.y_pos === 22) {
                            alert("Arrived at High School!");
                        } else if (player.x_pos === 14 && player.y_pos === 21) {
                            alert("Arrived at DayJob!");
                        } else if (player.x_pos === 18 && player.y_pos === 21) {
                            alert("Arrived at Gymnasium!");
                        } else if (player.x_pos === 22 && player.y_pos === 21) {
                            alert("Arrived at Hospital!");
                        } else if (player.x_pos === 24 && player.y_pos === 21) {
                            alert("Arrived at College!");
                        } else if (player.x_pos === 24 && player.y_pos === 22) {
                            alert("Arrived at College!");
                        } 
                    }
                    break;
                default:
                    break;
            };
            movequeue.shift();
            setMoves(movequeue);
        };
    }

    // PAUSE MENU
    function update_game_1() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears most of the canvas
        ctx.clearRect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);
        
        // Pause menu background color
        ctx.fillStyle = "beige";
        ctx.fillRect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);
        
        // Pause menu border
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);
        
        // Pause menu pause text
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.fillText("PAUSED", MAX_WIDTH / 2, MAX_HEIGHT / 4 - 2 * locations_module.UNIT_SIZE, 6 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        // Pause menu pause text border
        ctx.rect(MAX_WIDTH / 2 - 3 * locations_module.UNIT_SIZE, MAX_HEIGHT / 4 - 3.5 * locations_module.UNIT_SIZE, 6 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        // Save Slot 1 text border
        ctx.rect(2 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 4 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 2 + 4 * locations_module.UNIT_SIZE);
    
        // Save/Load for Slot 1
        ctx.font = '30px serif';
        ctx.textAlign = "left";
        ctx.rect(2 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Load Slot 1", 2 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.rect(7.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Save Slot 1", 7.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        // Save Slot 2 text border
        ctx.rect(MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 4 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 2 + 4 * locations_module.UNIT_SIZE);

        // Save/Load for Slot 2
        ctx.rect(MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Load Slot 2", MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.rect(MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Save Slot 2", MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        // Save Slot 3 text border
        ctx.rect(MAX_WIDTH * 2 / 3, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 4 + 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 2 + 4 * locations_module.UNIT_SIZE);
        
        // Save/Load for Slot 3
        ctx.rect(MAX_WIDTH * 2 / 3, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Load Slot 3", MAX_WIDTH * 2 / 3, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.rect(MAX_WIDTH * 2 / 3 + 5.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);
        ctx.fillText("  Save Slot 3", MAX_WIDTH * 2 / 3 + 5.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE, 5.5 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        ctx.stroke();
    };

    // Character Selection Screen
    function update_game_2() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        // Clears most of the canvas
        ctx.clearRect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);
        
        // Character selection menu background color
        ctx.fillStyle = "beige";
        ctx.fillRect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);
        
        // Character selection menu border
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(locations_module.UNIT_SIZE, locations_module.UNIT_SIZE, MAX_WIDTH - 2 * locations_module.UNIT_SIZE, MAX_HEIGHT + locations_module.TOP_BUFFER - 2 * locations_module.UNIT_SIZE);

        // Character selection menu pause text
        ctx.font = '48px serif';
        ctx.fillStyle = "black";
        ctx.textAlign = "center"; 
        ctx.fillText(" Character Selection ", MAX_WIDTH / 2, MAX_HEIGHT / 4 - 2 * locations_module.UNIT_SIZE, 8 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);

        // Character selection menu text border
        ctx.rect(MAX_WIDTH / 2 - 4 * locations_module.UNIT_SIZE, MAX_HEIGHT / 4 - 3.5 * locations_module.UNIT_SIZE, 8 * locations_module.UNIT_SIZE, 2 * locations_module.UNIT_SIZE);


        // Save Slot 1 text border
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
        ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);

        ctx.stroke();
    }

    // Sprite drawer
    function draw_sprite(ctx, direction, sprite_sheet_type) {
        let sprite_sheet = document.getElementById(sprite_sheet_type);
        switch (direction) {
            case locations_module.DIRECTION.UP:
                draw_animation(ctx, 1 + animation_stage, sprite_sheet);
                break;
            case locations_module.DIRECTION.DOWN:
                draw_animation(ctx, 4 + animation_stage, sprite_sheet);
                break;
            case locations_module.DIRECTION.LEFT:
                draw_animation(ctx, 7 + animation_stage, sprite_sheet);
                break;
            case locations_module.DIRECTION.RIGHT:
                draw_animation(ctx, 10 + animation_stage, sprite_sheet);
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
            } else {
                animation_stage = 1;
            }
        }
    }

    // For draw_sprite()
    function draw_animation(ctx, sprite_no, sprite_sheet) {
        switch(sprite_no) {
            // Up
            case 1:
                ctx.drawImage(sprite_sheet, 0, 0, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 2:
                ctx.drawImage(sprite_sheet, 128, 0, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER + 16, 64, 64);
                break;
            case 3:
                ctx.drawImage(sprite_sheet, 64, 192, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            // Down
            case 4:
                ctx.drawImage(sprite_sheet, 128, 64, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 5:
                ctx.drawImage(sprite_sheet, 128, 192, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER - 16, 64, 64);
                break;
            case 6:
                ctx.drawImage(sprite_sheet, 128, 128, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            // Left
            case 7:
                ctx.drawImage(sprite_sheet, 0, 128, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 8:
                ctx.drawImage(sprite_sheet, 0, 64, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2 + 16, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 9:
                ctx.drawImage(sprite_sheet, 0, 192, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            // Right
            case 10:
                ctx.drawImage(sprite_sheet, 64, 0, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 11:
                ctx.drawImage(sprite_sheet, 64, 128, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2 - 16, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
            case 12:
                ctx.drawImage(sprite_sheet, 64, 64, 64, 64, player.get_x_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE / 2, player.get_y_pos() * locations_module.UNIT_SIZE - locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 64, 64);
                break;
        }
    }

    // To increment in-game time
    function pass_time(time_passed) {
        setTime((time + time_passed) % 24);
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
                    movequeue.push(0); // move_left();
                }
                break;
            case 39: // Right
            case 68: // D
                if(play) {
                    movequeue.push(1); // move_right();
                }
                break;
            case 38: // up
            case 87: // W
                if(play) {
                    movequeue.push(2); // move_up();
                }
                break;
            case 40: // Down
            case 83: // S
                if(play) {
                    movequeue.push(3); // move_down();
                }
                break;
            case 32: // Space
            case 70: // F
                if(play) {
                    movequeue.push(4); // interact();
                }
                break;
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
                if (setup) {
                    if (game_state === 2) {
                        setGameState(0);
                        setPlay(true);
                    } else {
                        setGameState(2);
                        setPlay(false);
                    }
                }
            default: 
                return; // exit this handler for other keys
        }
        setMoves(movequeue);
    };

    function on_click(e) {
        let canvas = document.getElementById("game-canvas");
        let x = e.pageX - canvas.getBoundingClientRect().left;
        let y = e.pageY - canvas.getBoundingClientRect().top;
        switch (game_state) {
            case 0:
                break;
            case 1:
                console.log(e);
                console.log(x, y);
                if (x > 2 * locations_module.UNIT_SIZE && x < 2 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Loaded Slot 1!");
                } else if (x > 7.5 * locations_module.UNIT_SIZE && x < 7.5 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Saved Slot 1!");
                } else if (x > MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE && x < MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Loaded Slot 2!");
                } else if (x > MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && x < MAX_WIDTH / 3 + 1 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Saved Slot 2!");
                } else if (x > MAX_WIDTH * 2 / 3 && x < MAX_WIDTH * 2 / 3 + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Loaded Slot 3!");
                } else if (x > MAX_WIDTH * 2 / 3 + 5.5 * locations_module.UNIT_SIZE && x < MAX_WIDTH * 2 / 3 + 5.5 * locations_module.UNIT_SIZE + 5.5 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 0.75 * locations_module.UNIT_SIZE + 1 * locations_module.UNIT_SIZE) {
                    alert("Saved Slot 3!");
                };
                break;
            case 2:
                console.log(e);
                console.log(x, y);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE, MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);
                // ctx.rect(2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE), MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE, MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE, MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE);

                if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch0!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch1!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch2!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch3!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch4!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch5!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 1 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch6!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 2 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch7!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 3 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch8!");
                } else if (x > 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) && x < 2 * locations_module.UNIT_SIZE + 0.5 * locations_module.UNIT_SIZE + 4 * (MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE) + MAX_WIDTH / 5 - 1 * locations_module.UNIT_SIZE && y > MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE && y < MAX_HEIGHT / 3 - 2 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE + MAX_HEIGHT / 5 + 4 * locations_module.UNIT_SIZE) {
                    alert("ch9!");
                };
                break;
            default:
                break;
        }
    };

    return (
        <table id="game-table">
            <tr>
                <td id="left-column">
                    <p>Left column</p>
                    <p>Play: {1 ? play : 2}</p>
                    <p>{ticks}</p>
                    <p>{player.direction}</p>
                    <p>({player.x_pos},{player.y_pos})</p>
                    <p>HEALTH POINTS: {player._hp}</p>
                    <p>CASH: ${player._cash}</p>
                    <p>STRENGTH: {player._strength}</p>
                    <p>INTELLIGENCE: {player._intelligence}</p>
                    <p>MORALE:{player._morale}</p>
                    <p>PLAYER CLASS: {player._type}</p>
                    {/* This Cynthia is in public */}
                    <img src={player.img.src} alt="Cynthia not here wtf" id="FemaleCollegeStudent" style={{display: 'none'}}></img>
                    {/* Top row buildings */}
                    <img src="/images/dirt_path.png" alt="Cynthia not here wtf" id="dirt-path" style={{display: 'none'}}></img>
                    <img src="/images/tree_2.png" alt="Cynthia not here wtf" id="tree-2" style={{display: 'none'}}></img>
                    <img src="/images/homes/apartment.png" alt="Cynthia not here wtf" id="home" style={{display: 'none'}}></img>
                    <img src="/images/neighbor.png" alt="Cynthia not here wtf" id="neighbor" style={{display: 'none'}}></img>
                    <img src="/images/city_hall.png" alt="Cynthia not here wtf" id="city-hall" style={{display: 'none'}}></img>
                    <img src="/images/store1.png" alt="Cynthia not here wtf" id="store-1" style={{display: 'none'}}></img>
                    <img src="/images/store2.png" alt="Cynthia not here wtf" id="store-2" style={{display: 'none'}}></img>
                    <img src="/images/store3.png" alt="Cynthia not here wtf" id="store-3" style={{display: 'none'}}></img>
                    <img src="/images/store4.png" alt="Cynthia not here wtf" id="store-4" style={{display: 'none'}}></img>
                    <img src="/images/tree.png" alt="Cynthia not here wtf" id="tree-1" style={{display: 'none'}}></img>
                    {/* Row two buildings */}
                    <img src="/images/park.png" alt="Cynthia not here wtf" id="park" style={{display: 'none'}}></img>
                    <img src="/images/object_garden.png" alt="Cynthia not here wtf" id="object-garden" style={{display: 'none'}}></img>
                    <img src="/images/cin_n_cout.png" alt="Cynthia not here wtf" id="cin-n-cout" style={{display: 'none'}}></img>
                    <img src="/images/foobar.png" alt="Cynthia not here wtf" id="foobar" style={{display: 'none'}}></img>
                    <img src="/images/casino.png" alt="Cynthia not here wtf" id="casino" style={{display: 'none'}}></img>
                    {/* Row Three buildings (Just the library) */}
                    <img src="/images/library.png" alt="Cynthia not here wtf" id="library" style={{display: 'none'}}></img>
                    {/* Row Four buildings (Just the park one) */}
                    {/* Row Five buildings (NOT COLLEGE) */}
                    <img src="/images/highschool.png" alt="Cynthia not here wtf" id="highschool" style={{display: 'none'}}></img>
                    <img src="/images/work.png" alt="Cynthia not here wtf" id="work" style={{display: 'none'}}></img>
                    <img src="/images/gym.png" alt="Cynthia not here wtf" id="gym" style={{display: 'none'}}></img>
                    <img src="/images/hospital.png" alt="Cynthia not here wtf" id="hospital" style={{display: 'none'}}></img>
                    {/* Row Six building (College has different left side than others) */}
                    <img src="/images/college.png" alt="Cynthia not here wtf" id="college" style={{display: 'none'}}></img>
                </td>
                <td id="center-column">
                    <canvas ref={canvasRef} width={MAX_WIDTH} height={MAX_HEIGHT + locations_module.TOP_BUFFER} id="game-canvas" onClick={(e) => {on_click(e)}}/>
                </td>
                <td id="right-column">
                    <p>Right column</p>
                </td>
            </tr>
        </table>
    );
};

export default COVID_SMASHER;