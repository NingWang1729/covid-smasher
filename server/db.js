import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()

// Connect to our MongoDB database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Set up error logging, log that it started
const db = mongoose.connection
db.on('error', console.error)
db.once('open', () => console.log('Connected to Mongoose!'))
