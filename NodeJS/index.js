const DotEnv = require('dotenv') // Environment file importer
const Api = require('./Api')
const Database = require('./Database')
const Binance = require('./Binance')
// const BotManager = require('./BotManager')

//Initilaziation
const Main = async () => {
  DotEnv.config('.env')

  await Database.Main()
  await Binance.Main({
    apiKey: process.env.ApiKey,
    apiSecret: process.env.ApiSecret
  })
  Api.Main()

  // BotManager.StartBot({ symbol: 'BTCUSDT', interval: '1m', conversionLength: 9, baseLength: 26 })
  // BotManager.Logs.push({ Symbol: 'BTCUSDT', Date: new Date(), Cross: 2 })
}

Main()
