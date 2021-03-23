import React, { useState, useEffect } from 'react';
import './covid_smasher.css';
import './base_classes/locations.js';
import './base_classes/timezones.js';
import './base_classes/player.js';
import { useRef } from 'react';

function COVID_SMASHER() {
    const canvasRef = useRef(null);
    // Use 24hr clock, for easy modding
    const [time, setTime] = useState(0);

    function pass_time(time_passed) {
        setTime((time + time_passed) % 24);
    };

    // Initializes display screen
    useEffect(()=>{
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "blue";
        ctx.fillRect(10, 10, 200, 100);
    }, []);
    return (
        <table id="game-table">
          <tr>
            <td id="left-column">
              <p>Left column</p>
            </td>
            <td id="center-column">
              <canvas ref={canvasRef} width="1024" height="768" id="game-canvas"/>
            </td>
            <td id="right-column">
              <p>Right column</p>
            </td>
          </tr>
        </table>
    );
};
export default COVID_SMASHER;