const { Router } = require('express')
const BotManager = require('../../BotManager')

const router = Router()

router.post('/start', async (req, res) => {
  BotManager.StartBot(req.body)
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((ex) => {
      res.status(500).json({ error: 'Internal Error. Contact With Me.', ex })
    })
})

module.exports = router
