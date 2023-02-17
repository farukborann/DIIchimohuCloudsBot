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

module.exports.Main = async ({ apiKey, apiSecret }) => {
  const Settings = { apiKey, apiSecret }

  module.exports.Client = Binance.default(Settings)

  let TestConnection = await module.exports.Client.futuresPing()
  if (TestConnection === true) {
    console.log('Binance Connetion Successful.')
    return
  }

  console.log('Binance Connection Failed !!!')
}

module.exports.GetKlines = async (Symbol, Interval, Limit, StartDate, EndDate) => {
  let Klines = await module.exports.Client.futuresCandles({ symbol: Symbol, interval: Interval, limit: Limit, startTime: StartDate, endTime: EndDate })
  Klines = Klines.map((Kline) => {
    return Kline
  })
  return Klines
}

module.exports.GetExchangeInfo = async () => {
  let ExchangeInfo = await module.exports.Client.futuresExchangeInfo()
  return ExchangeInfo
}

module.exports.GetSymbolSettings = async (Symbol) => {
  try {
    let SymbolSettings = (await module.exports.Client.futuresPositionRisk({ symbol: Symbol }))[0]
    let MaxLeverage = (await module.exports.Client.futuresLeverageBracket({ symbol: Symbol }))[0].brackets[0].initialLeverage

    let MarginMode = SymbolSettings.marginType === 'cross' ? 'Cross' : 'Isolated'
    return { MarginMode, CurrentLeverage: parseInt(SymbolSettings.leverage), MaxLeverage }
  } catch {
    return { MarginMode: 'Cross', CurrentLeverage: -1, MaxLeverage: -1 }
  }
}

module.exports.GetSymbolPrice = async (Symbol) => {
  let Price = await module.exports.Client.futuresPrices({ symbol: Symbol })
  return { Price: parseFloat(Price[Symbol]) }
}

module.exports.SetSymbolSettings = async (Symbol, Leverage, MarginMode) => {
  let SymbolSettings = await this.GetSymbolSettings(Symbol)

  if (SymbolSettings.CurrentLeverage !== Leverage) {
    await module.exports.Client.futuresLeverage({ symbol: Symbol, leverage: Leverage })
  }
  if (!(MarginMode === 'Cross' && SymbolSettings.MarginMode === 'Cross') && !(MarginMode === 'Isolated' && SymbolSettings.MarginMode === 'Isolated')) {
    await module.exports.Client.futuresMarginType({ symbol: Symbol, marginType: MarginMode === 'Cross' ? 'CROSSED' : 'ISOLATED' })
  }

  return { result: true }
}

module.exports.StartCalculateIchimoku = async (Symbol, Interval, ConversionLength, BaseLength, CrossCallback) => {
  let klineCount = Math.max(ConversionLength, BaseLength)
  let Klines = (await module.exports.Client.futuresCandles({ symbol: Symbol, interval: Interval, limit: klineCount * 2 })).map((_kline) => {
    let kline = { openTime: _kline.openTime, closeTime: _kline.closeTime, open: parseFloat(_kline.open), high: parseFloat(_kline.high), low: parseFloat(_kline.low), close: parseFloat(_kline.close) }
    return kline
  })

  let priceStepSize = (await this.GetExchangeInfo()).symbols.find((pair) => pair.symbol === Symbol).filters.find((filter) => filter.filterType === 'PRICE_FILTER').tickSize

  for (let i = klineCount; i < Klines.length; i++) {
    let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(i - klineCount, i), ConversionLength, BaseLength, priceStepSize)
    Klines[i].conversionValue = conversionValue
    Klines[i].baseValue = baseValue
  }

  let InCallback = false
  let ConnectionClose = module.exports.Client.ws.futuresCandles(Symbol, Interval, async (_kline) => {
    if (InCallback) return
    if (_kline.isFinal) {
      if (Klines.at(-1).closeTime === _kline.closeTime) {
        Klines.at(-1).high = parseFloat(_kline.high)
        Klines.at(-1).low = parseFloat(_kline.low)
        Klines.at(-1).close = parseFloat(_kline.close)
        Klines.at(-1).open = parseFloat(_kline.open)

        let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(Klines.length - klineCount, Klines.length), ConversionLength, BaseLength, priceStepSize)
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

        let { conversionValue, baseValue } = Ichimoku.Calculate(Klines.slice(Klines.length - klineCount, Klines.length), ConversionLength, BaseLength, priceStepSize)
        kline.conversionValue = conversionValue
        kline.baseValue = baseValue
      }

      let isCrossing = Helpers.DedectCross(
        Klines.map((Kline) => {
          return Kline.conversionValue
        }),
        Klines.map((Kline) => {
          return Kline.baseValue
        })
      )
      if (isCrossing === 1 || isCrossing === 2) {
        InCallback = true
        await CrossCallback(isCrossing)
        InCallback = false
      }
    }
  })

  return { Klines, ConnectionClose }
}
