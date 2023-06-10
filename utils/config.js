const dotenv = require('dotenv')

dotenv.config()

const MONGO_URL = process.env.MONGO_URL
const BASE_URL = process.env.BASE_URL

const config = {
  mongo_url: MONGO_URL,
  base_url: BASE_URL,
}

module.exports = config
