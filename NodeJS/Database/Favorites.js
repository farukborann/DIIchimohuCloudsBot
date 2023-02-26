// const Mongoose = require('mongoose')
const Favorites = require('./Models/Favorites')

module.exports.AddFavorite = async (Symbol) => {
  let Favorite = await Favorites.create({ Symbol })
  return Favorite
}

module.exports.DelFavorite = async (Symbol) => {
  let Favorite = await Favorites.findOneAndDelete({ Symbol })
  return Favorite
}

module.exports.GetFavorites = async () => {
  return (await Favorites.find({})).map((Favorite) => Favorite.Symbol)
}
