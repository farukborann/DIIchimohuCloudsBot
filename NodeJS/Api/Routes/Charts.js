const { Router } = require('express')
const Binance = require('../../Binance')
const BotManager = require('../../BotManager')

//Initilaziation
const router = Router()

//Routes
router.post('/get_chart', async (req, res) => {
  if (!req.body?.symbol || !req.body?.interval) return res.end()
  let Bot = BotManager.GetBot(req.body.symbol, req.body.interval)

  if (Bot === undefined) {
    let Klines = await Binance.GetKlines(req.body.symbol, req.body.interval, 75)
    return res.json(Klines)
  }

  return res.json(Bot.Calculation.Klines)
})

module.exports = router
