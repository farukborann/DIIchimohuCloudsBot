const { Router } = require('express')
const PublicRouter = require('./Public')
const IndicatorsRouter = require('./Indicators')

//Initilaziation
const router = Router()

//Routes
router.use('/public', PublicRouter)
router.use('/indicators', IndicatorsRouter)

module.exports = router
