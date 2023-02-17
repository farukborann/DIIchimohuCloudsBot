const { Router } = require('express')
const Backtest = require('../../Backtest')

const router = Router()

router.get('/historical', async (req, res) => {
  let historical = await Backtest.Backtest({ Symbol: 'BTCUSDT', Interval: '1h', StartDate: new Date('01-02-2023'), EndDate: new Date(), BaseLength: 9, ConversionLength: 26 })
  return res.json(historical)
})

module.exports = router
