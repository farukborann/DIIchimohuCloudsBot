const { GetKlines } = require('./Klines')
const { Calculate } = require('../Binance/Ichimoku')
const { GetExchangeInfo } = require('../Binance/')

module.exports.Backtest = async ({ Symbol, Interval, StartDate, EndDate, ConversionLength, BaseLength, Cross1Order, Cross2Order }) => {
  console.log('Backtest => Başladı =>', Symbol, Interval, StartDate, EndDate)
  console.log('Backtest => Veriler çekiliyor.')

  const MaxLength = Math.max(ConversionLength, BaseLength)
  let StepSize = (await GetExchangeInfo()).symbols.find((pair) => pair.symbol === Symbol).filters.find((filter) => filter.filterType === 'PRICE_FILTER').tickSize
  const Klines = await GetKlines(Symbol, Interval, StartDate, EndDate)

  console.log('Backtest => Veriler çekildi.')
  console.log('Backtest => Ichimoku Hesaplanıyor.')

  for (let i = MaxLength; i < Klines.length; i++) {
    let CalcKlines = Klines.slice(i - MaxLength, i)
    let { conversionValue, baseValue } = Calculate(CalcKlines, ConversionLength, BaseLength, StepSize)
    Klines[i].conversionValue = conversionValue
    Klines[i].baseValue = baseValue
  }

  console.log('Backtest => Ichimoku Hesaplandı.')
  console.log('Backtest => İşlemler Hesaplanıyor.')
  for (let i = MaxLength; i < Klines.length; i++) {}

  console.log('Backtest => İşlemler Hesaplandı.')
  console.log('Backtest => Sonuç = ')
  return Klines
}
