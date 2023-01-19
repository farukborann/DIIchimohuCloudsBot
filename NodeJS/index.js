const DotEnv = require('dotenv') // Environment file importer
const Api = require('./Api')
const Database = require('./Database')
const Binance = require('./Binance')

//Initilaziation
const Main = async () => {
  DotEnv.config('.env')

  await Database.Main()
  await Binance.Main({
    apiKey: process.env.ApiKey,
    apiSecret: process.env.ApiSecret
  })
  Api.Main()

  Binance.StartCalculateIchimoku('BTCUSDT', '1m', 9, 26)
}

Main()
