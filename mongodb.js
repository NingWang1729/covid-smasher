require('dotenv').config()
const { DB_USERNAME, DB_PASSWORD, DB_URL, DB_NAME } = process.env

const mongoose = require('mongoose')
const { Schema } = mongoose

const { MongoClient } = require('mongodb')
const URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}/${DB_NAME}?retryWrites=true&w=majority`

/*
async function run() {
  const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  client
    .connect()
    .then(db => {
      console.log('Connected to MongoDB!')
    })
    .catch(err => {
      console.error(err)
      console.log('Could not connect to MongoDB!')
    })
}
*/

mongoose.connect(URI, {
  useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => console.log('Connected to Mongoose!'))

// Structure that all save objects need to follow
const saveSchema = new Schema({
  position: {
    x: { type: Number, required: true, min: 0, max: 39 },
    y: { type: Number, required: true, min: 0, max: 23 },
  },
  direction: { type: Number, required: true },
  stats: {
    intelligence: { type: Number, required: true, min: 0, max: 100 },
    strength: { type: Number, required: true, min: 0, max: 100 },
    morale: { type: Number, required: true, min: 0, max: 100 },
    sustenance: { type: Number, required: true, min: 0, max: 100 }, // TO-DO: Change this later
    health: { type: Number, required: true, min: 0, max: 100 }, // Why 0-110 with 100 as max?
  },
  time: { type: Number, required: true, min: 0, max: 24 },
  money: { type: Number, required: true, min: 0, max: 99999 },
  inventory: { type: Array, required: false } // Not required for now
})
const Save = mongoose.model('Save', saveSchema)

// Support basic CRUD operations for saving

// Create OR update save
async function createOrUpdateSave() {}

// Delete save
async function resetSave() {}

// Read save
async function loadSave() {
  
}

run()
