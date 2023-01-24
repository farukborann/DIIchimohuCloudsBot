const { Router } = require('express')
const Binance = require('../../Binance')

const router = Router()

router.get('/exchange_info', async (req, res) => {
  let ExchangeInfo = await Binance.GetExchangeInfo()
  return res.json(ExchangeInfo)
})

module.exports = router
