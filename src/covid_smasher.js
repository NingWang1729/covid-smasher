import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import './covid_smasher.css';

const locations_module = require('./base_classes/locations.js');
const timezones_module = require('./base_classes/timezones.js');
const player_module = require('./base_classes/player.js');

const player = new player_module.player(2, 5);
var animated = false;
var animation_stage = 0;

function COVID_SMASHER() {
    // CANVAS WIDTH
    const MAX_WIDTH = 1280;
    // CANVAS HEIGHT
    const MAX_HEIGHT = 768;
    // Canvas for drawing the game
    const canvasRef = useRef(null);
    // Play is boolean for play/pause
    const [play, setPlay] = useState(true);
    // ticks decide in game movement etc.
    const [ticks, setTicks] = useState(0);
    // Use 24hr clock, for easy modding, for in game time
    const [time, setTime] = useState(0);
    // Movequeue for storing keyboard inputs
    const [moves, setMoves] = useState([]);
    
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
        update_game();
        setTicks(ticks + 1)
    }

    function update_game () {
        let movequeue = moves;
        if (moves.length > 0 && ticks % 2 === 0) {
            switch (movequeue[0]) {
                case 0:
                    if (player.direction === locations_module.DIRECTION.LEFT && player.x_pos > 0 && locations_module.WORLD_MAP[player.y_pos][player.x_pos - 1] === 0) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 1:
                    if (player.direction === locations_module.DIRECTION.RIGHT && player.x_pos < locations_module.WORLD_WIDTH - 1 && locations_module.WORLD_MAP[player.y_pos][player.x_pos + 1] === 0) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 2:
                    if (player.direction === locations_module.DIRECTION.UP && player.y_pos > 0 && locations_module.WORLD_MAP[player.y_pos - 1][player.x_pos] === 0) {
                        animated = true;
                    } else {
                        animation_stage = 0;
                        animated = false;
                    };
                    break;
                case 3:
                    if (player.direction === locations_module.DIRECTION.DOWN && player.y_pos < locations_module.WORLD_HEIGHT - 1 && locations_module.WORLD_MAP[player.y_pos + 1][player.x_pos] === 0) {
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
        ctx.fillRect(0 *  locations_module.UNIT_SIZE, 17 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 7 * locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE);
        ctx.fillRect(12 *  locations_module.UNIT_SIZE, 17 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 13 * locations_module.UNIT_SIZE, 4 * locations_module.UNIT_SIZE);
        ctx.fillRect(25 *  locations_module.UNIT_SIZE, 17 * locations_module.UNIT_SIZE + locations_module.TOP_BUFFER, 15 * locations_module.UNIT_SIZE, 7 * locations_module.UNIT_SIZE);
        

        let home = document.getElementById("home");
        ctx.drawImage(home, -0, -48 + locations_module.TOP_BUFFER);

        let neighbor = document.getElementById("neighbor");
        ctx.drawImage(neighbor, 128, -16 + locations_module.TOP_BUFFER);

        let city_hall = document.getElementById("city-hall");
        ctx.drawImage(city_hall, 256, -56 + locations_module.TOP_BUFFER);

        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(((player.get_x_pos() * locations_module.UNIT_SIZE) + (locations_module.UNIT_SIZE / 2)),
                ((player.get_y_pos() * locations_module.UNIT_SIZE) + (locations_module.UNIT_SIZE / 2) + locations_module.TOP_BUFFER),
                (locations_module.UNIT_SIZE / 2), 0, 2 * Math.PI);
        ctx.fill();
        draw_sprite(ctx, player.direction);
        
        
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
                default:
                    break;
            };
            movequeue.shift();
            setMoves(movequeue);
        };
    }

    // Sprite drawer
    function draw_sprite(ctx, direction) {
        let sprite_sheet = document.getElementById("player-sprite-sheet");
        switch (direction) {
            case locations_module.DIRECTION.UP:
                draw_animation(ctx, 1 + animation_stage);
                break;
            case locations_module.DIRECTION.DOWN:
                draw_animation(ctx, 4 + animation_stage);
                break;
            case locations_module.DIRECTION.LEFT:
                draw_animation(ctx, 7 + animation_stage);
                break;
            case locations_module.DIRECTION.RIGHT:
                draw_animation(ctx, 10 + animation_stage);
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

    function draw_animation(ctx, sprite_no) {
        let sprite_sheet = document.getElementById("player-sprite-sheet");
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
                    e.preventDefault();
                    movequeue.push(2); // move_up();
                }
                break;
            case 40: // Down
            case 83: // S
                if(play) {
                    e.preventDefault();
                    movequeue.push(3); // move_down();
                }
                break;
            case 32: // Space
            case 70: // F
                if(play) {
                    e.preventDefault();
                    movequeue.push(4); // interact();
                }
                break;
            case 80: // P
                e.preventDefault();
                if (play) {
                } else {
                }
                setPlay(!play);
                break;
            default: 
                return; // exit this handler for other keys
        }
        setMoves(movequeue);
    };

    return (
        <table id="game-table">
            <tr>
                <td id="left-column">
                    <p>Left column</p>
                    <p>{ticks}</p>
                    <p>{player.direction}</p>
                    <p>({player.x_pos},{player.y_pos})</p>
                    {/* This Cynthia is in public */}
                    <img src={player.img.src} alt="Cynthia not here wtf" id="player-sprite-sheet" style={{visibility: 'hidden'}}></img>
                    {/* Top row buildings */}
                    <img src="/images/homes/Apartment.png" alt="Cynthia not here wtf" id="home" style={{visibility: 'hidden'}}></img>
                    <img src="/images/Neighbor.png" alt="Cynthia not here wtf" id="neighbor" style={{visibility: 'hidden'}}></img>
                    <img src="/images/City_hall.png" alt="Cynthia not here wtf" id="city-hall" style={{visibility: 'hidden'}}></img>
                    {/* Row two buildings */}
                    {/* Row Three buildings (Just the library) */}
                    {/* Row Four buildings (Just the park one) */}
                    {/* Row Five buildings (NOT COLLEGE) */}
                    {/* Row Six building (College has different left side than others) */}
                </td>
                <td id="center-column">
                    <canvas ref={canvasRef} width={MAX_WIDTH} height={MAX_HEIGHT + locations_module.TOP_BUFFER} id="game-canvas"/>
                </td>
                <td id="right-column">
                    <p>Right column</p>
                </td>
            </tr>
        </table>
    );
};
export default COVID_SMASHER;