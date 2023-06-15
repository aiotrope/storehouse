const mongoose = require('mongoose')

const Recipe = require('../models/recipe')

const opts = {
  autoIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

const dbConnection = async () => {
  mongoose.set('strictQuery', false)

  const dbURL = 'mongodb://127.0.0.1:27017/testdb'

  mongoose.connect(dbURL, opts)

  const conn = mongoose.connection

  conn.once('open', async () => {
    console.log(`Database connected: ${dbURL}`)

    let recordCount = await conn.db
      .collection('Recipes')
      .estimatedDocumentCount()
    if (recordCount === 0) {
      await Recipe.insertMany([
        {
          name: 'Mole',
          instructions: [
            'Gather the ingredients.',
            'Make the Mole Base',
            'Mix and Cook the Mole',
          ],
          ingredients: [
            '12 large guajillo chiles',
            '1/4 cup corn masa harina',
            '1/4 cup unsalted peanuts',
            '1/4 cup raisins',
            '1 whole clove',
          ],
        },
      ])
    }
  })

  conn.on('error', (error) => {
    console.error(`connection error: ${error}`)
  })
}

module.exports = dbConnection
