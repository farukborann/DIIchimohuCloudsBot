const { Router } = require('express')
const Backtest = require('../../Backtest')

const router = Router()

router.post('/', async (req, res) => {
  let historical = await Backtest.Backtest(req.body)
  return res.json(historical)
})

module.exports = router
