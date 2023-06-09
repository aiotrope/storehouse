const mongoose = require('mongoose')
const config = require('./config')

let dbURL

const opts = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const dbConnection = () => {
  mongoose.set('strictQuery', false)
  dbURL = config.mongo_url
  mongoose.connect(dbURL, opts)

  const db = mongoose.connection
  db.once('open', () => {
    console.log(`Database connected: ${dbURL}`)
  })

  db.on('error', (error) => {
    console.error(`connection error: ${error}`)
  })
}

module.exports = dbConnection
