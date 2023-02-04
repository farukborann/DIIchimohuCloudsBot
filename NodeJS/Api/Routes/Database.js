const { Router } = require('express')
const Database = require('../../Database')

const router = Router()

router.post('/get_general_statistics', async (req, res) => {
  let _Statistics = await Database.GetGeneralStatistics(req.body.Symbol)
  return res.json(_Statistics)
})

router.post('/get_last_orders', async (req, res) => {
  let _LastOrders = await Database.GetLast20Order(req.body.Symbol)
  return res.json(_LastOrders)
})

module.exports = router
