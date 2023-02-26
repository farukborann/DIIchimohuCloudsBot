const { Router } = require('express')
const Database = require('../../Database')
const Favorites = require('../../Database/Favorites')

const router = Router()

router.post('/get_general_statistics', async (req, res) => {
  let _Statistics = await Database.GetGeneralStatistics(req.body.Symbol)
  return res.json(_Statistics)
})

router.post('/get_last_orders', async (req, res) => {
  let _LastOrders = await Database.GetLast100Order(req.body.Symbol)
  return res.json(_LastOrders)
})

router.post('/get_all_orders', async (req, res) => {
  let _AllOrders = await Database.GetAllOrders(req.body.Symbol)
  return res.json(_AllOrders)
})

router.post('/favorites/add', async (req, res) => {
  let Result = await Favorites.AddFavorite(req.body.Symbol)
  return res.json(Result)
})

router.post('/favorites/del', async (req, res) => {
  let Result = await Favorites.DelFavorite(req.body.Symbol)
  return res.json(Result)
})

router.get('/favorites/', async (req, res) => {
  let Result = await Favorites.GetFavorites()
  return res.json(Result)
})

module.exports = router
