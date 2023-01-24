const Binance = require('../Binance/')

let Bots = []

const CreateBotOrder = (order) => {}

// Cross1Order => Blue cross red
// Cross2Order => Red cross blue
module.exports.StartBot = async ({ symbol, interval, conversionLength, baseLength, cross1order, cross2order }) => {
  if (Bots.some((bot) => bot.symbol === symbol)) {
    return { error: 'Symbol has bot' }
  }

  let Calculation = await Binance.StartCalculateIchimoku(symbol, interval, conversionLength, baseLength, (crossType) => {
    if (crossType === 1) {
      CreateBotOrder(cross1order)
    } else if (crossType === 2) {
      CreateBotOrder(cross2order)
    }
    console.log(crossType)
  })

  Bots.push({ symbol, interval, Calculation })
  return { result: true }
}

module.exports.GetBot = (symbol, interval) => {
  return Bots.find((Bot) => Bot.symbol === symbol && Bot.interval === interval)
}

module.exports.StopBot = (symbol) => {
  let BotIndex = Bots.findIndex((Bot) => Bot.symbol === symbol)
  if (BotIndex === -1) return

  let Bot = Bots[BotIndex]
  Bot.Calculation.ConnectionClose()
  Bots.splice(BotIndex, 1)
  console.log('Bot stopped => ' + symbol + ' ' + interval)
}
