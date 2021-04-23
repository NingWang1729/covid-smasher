import mongoose from 'mongoose'
const { Schema } = mongoose

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
  inventory: { type: Array, required: false }, // Not required for now
})

export const Save = mongoose.model('Save', saveSchema)

/*
Here is an example of how you would use this:
1. Create a save object like this:
const defaultSave = {
  position: {
    x: 0,
    y: 0,
  },
  direction: 0,
  stats: {
    intelligence: 0,
    strength: 0,
    morale: 0,
    sustenance: 0,
    health: 0,
  },
  time: 0,
  money: 0,
  inventory: []
}

2. Use the Save() constructor and call it on that JS object
const mySave = new Save(defaultSave)

3. Use mongoose methods to save and log success/error
You can find the full list here: 

Here is an example of saving:
mySave.save().then(() => console.log('Saved a save!'))
*/
