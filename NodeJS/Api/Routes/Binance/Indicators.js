const { Router } = require('express')
const Binance = require('../../../Binance')

//Initilaziation
const router = Router()

//Routes
router.post('/ichimoku', async (req, res) => {
  let CalcIndex = Binance.IchimokuCalculations.findIndex((Calc) => Calc.symbol === req.body.symbol && Calc.interval === req.body.interval)


  if (CalcIndex === -1) {
    let Klines = await Binance.GetKlines(req.body.symbol, req.body.interval, 75)
    return res.json(Klines)
  }

  let Calc = Binance.IchimokuCalculations[CalcIndex]
  return res.json(Calc.data)
})

module.exports = router
