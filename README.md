## About

COVID Crusher is a classical pixel-based RPG to raise awareness for various social issues due to the COVID-19 pandemic. Covid Crusher uses a MongoDB/Express/React/NodeJS (MERN) stack with the database deployed on Google Cloud. It utilizes Google OAuth for keeping track of save states.

## Live Website
You can play this game [here](https://covid-smasher.ningwang1729.repl.co/)\! Read down below for instructions.

![image](https://user-images.githubusercontent.com/57082175/126050611-b5c61081-9462-426b-9fa5-169380584705.png)

## How To Play

**How to win:**
Reach 100 points in either strength, intelligence, or morale. You lose if your health or sustenance (hunger) goes to zero.

**Controls:**
- WASD or Arrow keys for movement
- X to interact with buildings/locations
- Mouse to interact with dialogues, use items from the inventory

**Tips:**
- Socially distance yourself from other players to avoid taking damage
- Each action will decrease your sustenance, but will increasee strength, intelligence, or morale. Buy food and other items in order to recover sustenance!
- Choose your character wisely! Each character has a different amount of starting cash, strength, intelligence, and morale which can drastically change the outcome of the game

Try to find all the easter eggs we built into this!

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

However, this will only run the frontend.
In order to connect to the database and allow for saving and OAuth, do:
`npm run build && node ./server/server.js` 

### `make git m="Enter commit message here" b="Enter branch name here"`

(You need to make a branch first on the repository)
