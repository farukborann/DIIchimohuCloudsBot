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

// let data9periot = data.slice(data.length - 9, data.length)

// let high9periot = data9periot[0].Kline.high
// data9periot.map((data) => {
//   if (data.Kline.high > high9periot) high9periot = data.Kline.high
// })

// let low9periot = data9periot[0].Kline.low
// data9periot.map((data) => {
//   if (data.Kline.low < low9periot) low9periot = data.Kline.low
// })

// let conversionLine = (parseFloat(high9periot) + parseFloat(low9periot)) / 2
// console.log('Conversion Line : ', conversionLine)

// let high26periot = data[0].Kline.high
// data.map((data) => {
//   if (data.Kline.high > high26periot) high26periot = data.Kline.high
// })

// let low26periot = data[0].Kline.low
// data.map((data) => {
//   if (data.Kline.low < low26periot) low26periot = data.Kline.low
// })

// let baseLine = (parseFloat(high26periot) + parseFloat(low26periot)) / 2
// console.log('Base Line : ', baseLine)
