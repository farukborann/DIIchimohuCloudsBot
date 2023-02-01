const { Router } = require('express')
const Binance = require('../../Binance')

const router = Router()

router.get('/exchange_info', async (req, res) => {
  let ExchangeInfo = await Binance.GetExchangeInfo()
  return res.json(ExchangeInfo)
})

router.post('/get_symbol_settings', async (req, res) => {
  let Settings = await Binance.GetSymbolSettings(req.body.Symbol)
  return res.json(Settings)
})

router.post('/set_symbol_settings', async (req, res) => {
  let Settings = await Binance.SetSymbolSettings(req.body.Symbol, req.body.Leverage, req.body.MarginMode)
  return res.json(Settings)
})

module.exports = router
