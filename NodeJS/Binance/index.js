const Binance = require('binance-api-node')

let IchimokuCalculations = []
module.exports.IchimokuCalculations = IchimokuCalculations

module.exports.Intervals = {
  oneMunite: '1m',
  threeMunites: '3m',
  fiveMunites: '5m',
  fifteenMunites: '15m',
  thirtyMunites: '30m',
  oneHour: '1h',
  threeHours: '2h',
  fourHours: '4h',
  sixHours: '6h',
  eightHours: '8h',
  twelveHours: '12h',
  oneDay: '1d',
  threeDays: '3d',
  oneWeek: '1w',
  oneMonth: '1M'
}

let BinanceClient

module.exports.Main = async ({ apiKey, apiSecret, testMode }) => {
  const Settings = { apiKey, apiSecret }

  if (testMode) {
    Settings.httpBase = 'https://testnet.binance.vision'
    Settings.httpFutures = 'https://testnet.binancefuture.com'
  }

  BinanceClient = Binance.default(Settings)

  let TestConnection = await BinanceClient.futuresPing()
  if (TestConnection === true) {
    console.log('Binance Connetion Successful.')
    return
  }

  console.log('Binance Connection Failed !!!')
}

module.exports.GetKlines = async (symbol, interval, limit) => {
  let Klines = await BinanceClient.futuresCandles({ symbol, interval, limit })
  Klines = Klines.map((Kline) => {
    return { Kline }
  })
  return Klines
}

module.exports.GetExchangeInfo = async () => {
  let ExchangeInfo = await BinanceClient.futuresExchangeInfo()
  return ExchangeInfo
}

module.exports.StartCalculateIchimoku = (symbol, interval) => {
  if (IchimokuCalculations.some((Calc) => Calc.symbol === symbol && Calc.interval === interval)) return

  let data = []
  let ConnectionClose = BinanceClient.ws.futuresCandles(symbol, interval, (Kline) => {
    if (!data.length) {
      data.push({ Kline })
      return
    }

    if (data.at(-1).Kline.closeTime != Kline.closeTime) {
      data.push({ Kline })
    }
    data.push({ Kline })
  })

  IchimokuCalculations.push({ symbol, interval, data, ConnectionClose })
}

module.exports.StopCalculateIchimoku = (symbol, interval) => {
  let CalcIndex = IchimokuCalculations.findIndex((Calc) => Calc.symbol === symbol && Calc.interval === interval)
  if (CalcIndex === -1) return

  let Calc = IchimokuCalculations[CalcIndex]
  Calc.ConnectionClose()
  IchimokuCalculations.splice(CalcIndex, 1)
}
