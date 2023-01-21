module.exports.Calculate = (klines, conversionLength, baseLength) => {
  if (klines.length < Math.max(conversionLength, baseLength)) {
    return { error: { message: 'Klines length error' } }
  }

  let conversionPeriots = klines.slice(klines.length - conversionLength, klines.length)
  let basePeriots = klines.slice(klines.length - baseLength, klines.length)

  let conversionResults = getHighLow(conversionPeriots)
  let baseResults = getHighLow(basePeriots)

  let conversionValue = (conversionResults.high + conversionResults.low) / 2
  let baseValue = (baseResults.high + baseResults.low) / 2

  return { conversionValue: parseFloat(conversionValue.toFixed(2)), baseValue: parseFloat(baseValue.toFixed(2)) }
}

const getHighLow = (klines) => {
  let high = klines[0].high
  let low = klines[0].low

  klines.map((kline) => {
    if (kline.high > high) high = kline.high
    if (kline.low < low) low = kline.low
  })

  return { high: high, low: low }
}
