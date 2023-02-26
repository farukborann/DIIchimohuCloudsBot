const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Favorite = Schema(
  {
    Symbol: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

const Modules = Mongoose.model('Favorites', Favorite)
module.exports = Modules
