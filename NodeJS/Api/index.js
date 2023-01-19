const Express = require('express') // Http server
const Morgan = require('morgan') // Terminal logging
const BinanceRouter = require('./Routes/Binance') // Terminal logging

let App

module.exports.Main = () => {
  App = Express()

  //Middlewares
  App.use(Morgan('dev'))
  App.use(Express.json())
  App.use(Express.static('public'))

  App.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  App.use('/binance', BinanceRouter)

  //Listen for requests
  App.listen(process.env.Port)
  console.log('Listening on port %s', process.env.Port)
  console.log('You can access => http://localhost:' + process.env.Port)
}
