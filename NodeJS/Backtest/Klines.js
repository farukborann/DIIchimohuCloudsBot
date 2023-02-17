const Binance = require('../Binance')

function intervalToSeconds(interval) {
  switch (interval) {
    case '1m':
      return 60
    case '3m':
      return 180
    case '5m':
      return 300
    case '15m':
      return 900
    case '30m':
      return 1800
    case '1h':
      return 3600
    case '2h':
      return 7200
    case '4h':
      return 14400
    case '6h':
      return 21600
    case '8h':
      return 28800
    case '12h':
      return 43200
    case '1d':
      return 86400
    case '3d':
      return 259200
    case '1w':
      return 604800
    default:
      return 0
  }
}

function calculateNumberOfCall(interval, startTime, endTime) {
  const intervalSeconds = intervalToSeconds(interval)
  const start = Math.floor(startTime / intervalSeconds) * intervalSeconds
  const end = Math.floor(endTime / intervalSeconds) * intervalSeconds
  const diff = end - start
  const optimal = Math.ceil(diff / intervalSeconds)
  const result = Math.ceil(optimal / 1000)
  if (isNaN(result)) {
    return 0
  }
  return result
}

function divideInterval(numberOfDivisions, startDate, endDate) {
  const interval = (endDate - startDate) / numberOfDivisions
  const divisions = []
  for (let i = 0; i < numberOfDivisions; i++) {
    divisions.push(Math.round(startDate + interval * i))
  }
  divisions.push(endDate)
  return divisions
}

module.exports.GetKlines = async (Symbol, Interval, StartDate, EndDate) => {
  if (StartDate.getTime() > EndDate.getTime()) {
    throw new Error('Start date must be before end date')
  }
  const numberOfCall = (0, calculateNumberOfCall)(Interval, StartDate.getTime(), EndDate.getTime())
  const numOfIterations = Math.ceil(numberOfCall / 1500)
  const divisions = (0, divideInterval)(numOfIterations, StartDate.getTime(), EndDate.getTime())
  let data = []
  for (let i = 0; i < divisions.length; i++) {
    if (i + 1 !== divisions.length) {
      const start = divisions[i]
      const end = divisions[i + 1]
      const response = (await Binance.GetKlines(Symbol, Interval, 1500, start, end)).map((Kline) => {
        return {
          openTime: Kline.openTime,
          closeTime: Kline.closeTime,
          open: parseFloat(Kline.open),
          high: parseFloat(Kline.high),
          low: parseFloat(Kline.low),
          close: parseFloat(Kline.close)
        }
      })
      data = [...data, ...response]
    }
  }
  if (data.length) --data.length
  return data
}
