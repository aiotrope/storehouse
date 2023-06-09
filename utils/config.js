const dotenv = require('dotenv')

dotenv.config()

const MONGO_URL = process.env.MONGO_URL

const config = {
  mongo_url: MONGO_URL
}

module.exports = config