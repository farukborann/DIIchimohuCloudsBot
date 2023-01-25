const { Router } = require('express')
const BotManager = require('../../BotManager')

const router = Router()

router.post('/start', async (req, res) => {
  BotManager.StartBot(req.body).then((result) => {
    return res.status(200).json(result)
  })
  // .catch((ex) => {
  //   return res.status(500).json({ error: 'Internal Error. Contact With Me.', ex })
  // })
})

router.get('/all', async (req, res) => {
  let Bots = BotManager.Bots.map((Bot) => {
    let _Bot = { ...Bot }
    delete _Bot.Calculation
    return _Bot
  })
  return res.json(Bots)
})

router.post('/stop', async (req, res) => {
  return res.json(BotManager.StopBot(req.body.Symbol))
})

module.exports = router
