import express from 'express'
import bodyParser from 'body-parser' // Do I really need this?
import path, { dirname } from 'path'

import { Save } from './mongodb.js'

import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
// const buildPath = path.join(__dirname, '../build')
const buildPath = path.join(__dirname)

const app = express()
app.use(express.static(buildPath))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Information only flows in two ways:
// 1. Get all saves user has
// 2. Update the save at the current slot

// Get all saves the user has
app.get('/save', async (req, res) => {
  // Get username from body of request
  const { username } = req.query

  // Get game saves for this user
  const gameSaves = await Save.find({ username })

  // Send back game saves
  res.send(gameSaves)
})

// Update the save at the current slot
app.post('/save', async (req, res) => {
  res.send('POST request for saving')

  // Get game state from the frontend
  const gameState = req.body

  // Overwrite the save at the current slot with this one
  await Save.findOneAndUpdate(
    { slot: gameState.slot, username: gameState.username },
    gameState,
    { upsert: true, useFindAndModify: false }
  )
})

app.get('/', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.listen(process.env.PORT || 3000)
