const Binance = require('binance-api-node')
const Ichimoku = require('./Ichimoku')
const Helpers = require('./Helpers')

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
  module.exports.Client = BinanceClient

  let TestConnection = await BinanceClient.futuresPing()
  if (TestConnection === true) {
    console.log('Binance Connetion Successful.')
    return
  }

  console.log('Binance Connection Failed !!!')
}

module.exports.GetKlines = async (Symbol, Interval, Limit) => {
  let Klines = await BinanceClient.futuresCandles({ symbol: Symbol, interval: Interval, limit: Limit })
  Klines = Klines.map((Kline) => {
    return Kline
  })
  return Klines
}

module.exports.GetExchangeInfo = async () => {
  let ExchangeInfo = await BinanceClient.futuresExchangeInfo()
  return ExchangeInfo
}

module.exports.StartCalculateIchimoku = async (Symbol, Interval, ConversionLength, BaseLength, CrossCallback) => {
  let klineCount = Math.max(ConversionLength, BaseLength)
  let Klines = (await BinanceClient.futuresCandles({ symbol: Symbol, interval: Interval, limit: klineCount * 2 })).map((_kline) => {
    let kline = { openTime: _kline.openTime, closeTime: _kline.closeTime, open: parseFloat(_kline.open), high: parseFloat(_kline.high), low: parseFloat(_kline.low), close: parseFloat(_kline.close) }
    return kline
  })

  for (let i = klineCount; i < Klines.length; i++) {
    let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(i - klineCount, i), ConversionLength, BaseLength)
    Klines[i].conversionValue = conversionValue
    Klines[i].baseValue = baseValue
  }

  let ConnectionClose = BinanceClient.ws.futuresCandles(Symbol, Interval, (_kline) => {
    if (_kline.isFinal) {
      if (Klines.at(-1).closeTime === _kline.closeTime) {
        Klines.at(-1).high = parseFloat(_kline.high)
        Klines.at(-1).low = parseFloat(_kline.low)
        Klines.at(-1).close = parseFloat(_kline.close)
        Klines.at(-1).open = parseFloat(_kline.open)

        let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(Klines.length - klineCount, Klines.length), ConversionLength, BaseLength)
        Klines.at(-1).conversionValue = conversionValue
        Klines.at(-1).baseValue = baseValue
      } else {
        let kline = {
          openTime: _kline.startTime,
          closeTime: _kline.closeTime,
          open: parseFloat(_kline.open),
          high: parseFloat(_kline.high),
          low: parseFloat(_kline.low),
          close: parseFloat(_kline.close)
        }
        Klines.at(-1).close = kline.open
        Klines.push(kline)
        Klines.splice(0, 1)

        let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(Klines.length - klineCount, Klines.length), ConversionLength, BaseLength)
        kline.conversionValue = conversionValue
        kline.baseValue = baseValue
      }

      let isCrossing = Helpers.DedectIndicatorCrossing(
        Klines.map((Kline) => {
          return Kline.conversionValue
        }),
        Klines.map((Kline) => {
          return Kline.baseValue
        })
      )
      if (isCrossing === 1 || isCrossing === 2) {
        CrossCallback(isCrossing)
      }
    }
  })

  return { Klines, ConnectionClose }
}
