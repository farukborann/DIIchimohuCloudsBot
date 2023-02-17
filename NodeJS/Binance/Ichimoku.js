const { RoundStep } = require('./Helpers')

module.exports.Calculate = (Klines, ConversionLength, BaseLength, StepSize) => {
  if (Klines.length < Math.max(ConversionLength, BaseLength)) {
    return { error: { message: 'Klines length error' } }
  }

  let conversionPeriots = Klines.slice(Klines.length - ConversionLength, Klines.length)
  let basePeriots = Klines.slice(Klines.length - BaseLength, Klines.length)

  let conversionResults = GetHighLow(conversionPeriots)
  let baseResults = GetHighLow(basePeriots)

  let conversionValue = (conversionResults.high + conversionResults.low) / 2
  let baseValue = (baseResults.high + baseResults.low) / 2

  return { conversionValue: RoundStep(conversionValue, StepSize), baseValue: RoundStep(baseValue, StepSize) }
}

const GetHighLow = (Klines) => {
  let high = Klines[0].high
  let low = Klines[0].low

  Klines.map((kline) => {
    if (kline.high > high) high = kline.high
    if (kline.low < low) low = kline.low
  })

  return { high: high, low: low }
}
