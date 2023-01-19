const Binance = require('binance-api-node')
const Ichimoku = require('./Ichimoku')
const Helpers = require('./Helpers')

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
    return Kline
  })
  return Klines
}

module.exports.GetExchangeInfo = async () => {
  let ExchangeInfo = await BinanceClient.futuresExchangeInfo()
  return ExchangeInfo
}

module.exports.StartCalculateIchimoku = async (symbol, interval, conversionLength, baseLength) => {
  if (IchimokuCalculations.some((Calc) => Calc.symbol === symbol && Calc.interval === interval)) return

  let klineCount = Math.max(conversionLength, baseLength)
  let klines = (await BinanceClient.futuresCandles({ symbol, interval, limit: klineCount * 2 })).map((_kline) => {
    let kline = { openTime: _kline.openTime, closeTime: _kline.closeTime, open: parseFloat(_kline.open), high: parseFloat(_kline.high), low: parseFloat(_kline.low), close: parseFloat(_kline.close) }
    return kline
  })

  for (let i = klineCount; i < klines.length; i++) {
    let { conversionValue, baseValue } = Ichimoku.Calculate(klines.slice(i - klineCount, i), conversionLength, baseLength)
    klines[i].conversionValue = conversionValue
    klines[i].baseValue = baseValue
  }

  let ConnectionClose = BinanceClient.ws.futuresCandles(symbol, interval, (_kline) => {
    if (_kline.isFinal) {
      if (klines.at(-1).closeTime == _kline.closeTime) {
        klines.at(-1).high = parseFloat(_kline.high)
        klines.at(-1).low = parseFloat(_kline.low)
        klines.at(-1).close = parseFloat(_kline.close)
        klines.at(-1).open = parseFloat(_kline.open)

        let { conversionValue, baseValue } = Ichimoku.Calculate(klines.slice(klines.length - klineCount, klines.length), conversionLength, baseLength)
        klines.at(-1).conversionValue = conversionValue
        klines.at(-1).baseValue = baseValue
      } else {
        let kline = {
          openTime: _kline.startTime,
          closeTime: _kline.closeTime,
          open: parseFloat(_kline.open),
          high: parseFloat(_kline.high),
          low: parseFloat(_kline.low),
          close: parseFloat(_kline.close)
        }
        klines.at(-1).close = kline.open
        klines.push(kline)
        klines.splice(0, 1)

        let { conversionValue, baseValue } = Ichimoku.Calculate(klines.slice(klines.length - klineCount, klines.length), conversionLength, baseLength)
        kline.conversionValue = conversionValue
        kline.baseValue = baseValue
      }

      let lastKline = klines.at(-1)
      let secondLastKline = klines.at(-2)
      let isCrossing = Helpers.DedectIndicatorCrossing(secondLastKline.conversionValue, lastKline.conversionValue, secondLastKline.baseValue, lastKline.baseValue)
      if (isCrossing === 1) {
        console.log('Conversion cross base')
      } else if (isCrossing === 2) {
        console.log('Base cross conversion')
      }
    }

    IchimokuCalculations.push({ symbol, interval, conversionLength, baseLength, klines, ConnectionClose })
  })
}

module.exports.StopCalculateIchimoku = (symbol, interval) => {
  let CalcIndex = IchimokuCalculations.findIndex((Calc) => Calc.symbol === symbol && Calc.interval === interval)
  if (CalcIndex === -1) return

  let Calc = IchimokuCalculations[CalcIndex]
  Calc.ConnectionClose()
  IchimokuCalculations.splice(CalcIndex, 1)
  console.log('Websocket connection ended for ' + symbol + ' ' + interval)
}
