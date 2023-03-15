const { GetKlines } = require('./Klines')
const { Calculate } = require('../Binance/Ichimoku')
const { GetExchangeInfo } = require('../Binance/')
const { DedectAllCrosses, CalculateOrders } = require('./Helpers')

module.exports.Backtest = async ({ Symbol, Interval, StartDate, EndDate, ConversionLength, BaseLength, Cross1Order, Cross2Order }) => {
  console.log('Backtest => Başladı =>', Symbol, Interval, StartDate, EndDate)
  console.log('Backtest => Veriler çekiliyor.')

  const MaxLength = Math.max(ConversionLength, BaseLength)
  let StepSize = (await GetExchangeInfo()).symbols.find((pair) => pair.symbol === Symbol).filters.find((filter) => filter.filterType === 'PRICE_FILTER').tickSize
  const Klines = await GetKlines(Symbol, Interval, new Date(StartDate), new Date(EndDate))

  console.log('Backtest => Veriler çekildi.')
  console.log('Backtest => Ichimoku Hesaplanıyor.')

  for (let i = MaxLength; i < Klines.length; i++) {
    let CalcKlines = Klines.slice(i - MaxLength, i + 1)
    let { conversionValue, baseValue } = Calculate(CalcKlines, ConversionLength, BaseLength, StepSize)
    Klines[i].conversionValue = conversionValue
    Klines[i].baseValue = baseValue
  }

  console.log('Backtest => Ichimoku Hesaplandı.')
  console.log('Backtest => Kesişimler Hesaplanıyor.')

  let { CrossesCount } = DedectAllCrosses(Klines, MaxLength)

  console.log('Backtest => Kesişimler Hesaplandı.')
  console.log('Backtest => İşlemler Hesaplanıyor.')

  let Result = CalculateOrders(Klines, Cross1Order, Cross2Order)

  console.log('Backtest => İşlemler Hesaplandı.')

  Result.Statistics = {
    ProfitedOrderCount: Result.AllOrders.filter((order) => order.Profit > 0).length,
    LossedOrderCount: Result.AllOrders.filter((order) => order.Profit < 0).length,
    OrderCount: Result.AllOrders.length,
    RealizedProfitsSum: Result.TotalProfit
  }

  Result.Statistics.WinRate = (Result.Statistics.ProfitedOrderCount / Result.AllOrders.length) * 100

  console.log('Backtest => Tamamlandı =>', Symbol, Interval, StartDate, EndDate)
  return { Klines, ...Result, CrossesCount }
}
