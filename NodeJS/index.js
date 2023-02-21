const DotEnv = require('dotenv') // Environment file importer
const Api = require('./Api')
const Database = require('./Database')
const Binance = require('./Binance')
const BotManager = require('./BotManager')

//Initilaziation
const Main = async () => {
  DotEnv.config('.env')

  await Database.Main()
  await Binance.Main({
    apiKey: process.env.ApiKey,
    apiSecret: process.env.ApiSecret
  })
  await BotManager.Main()
  Api.Main()
}

Main()
