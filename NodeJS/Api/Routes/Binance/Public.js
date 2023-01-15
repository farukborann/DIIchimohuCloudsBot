const { Router } = require('express')
const Binance = require('../../../Binance')

//Initilaziation
const router = Router()

//Routes
// router.post('/klines', async (req, res) => {
//   let Klines = await Binance.GetKlines(req.body.symbol, req.body.interval, 75)
//   return res.json(Klines)
// })

router.get('/exchangeInfo', async (req, res) => {
  let ExchangeInfo = await Binance.GetExchangeInfo()
  return res.json(ExchangeInfo)
})

module.exports = router
