const Binance = require('../Binance/')

let Bots = []
let ExchangeInfo
module.exports.Bots = Bots

function RoundStep(qty, stepSize) {
  // Integers do not require rounding
  if (Number.isInteger(qty)) return qty
  const qtyString = parseFloat(qty).toFixed(16)
  const desiredDecimals = Math.max(stepSize.indexOf('1') - 1, 0)
  const decimalIndex = qtyString.indexOf('.')
  return parseFloat(qtyString.slice(0, decimalIndex + desiredDecimals + 1))
}

const CreateBotOrder = async (Order) => {
  let MOrderId, SLOrderId, TPOrderId, Quantity, LastPrice, MarkPrice
  let Filters = ExchangeInfo.find((Pair) => {
    return Pair.symbol === Order.Symbol
  }).filters

  async function UpdateLastPrice() {
    if (!LastPrice) LastPrice = (await Binance.Client.futuresPrices({ symbol: Order.Symbol }))[Order.Symbol]
  }

  async function UpdateMarkPrice() {
    if (!MarkPrice) MarkPrice = (await Binance.Client.futuresMarkPrice({ symbol: Order.Symbol })).markPrice
  }

  let MainOrderSettings = {
    symbol: Order.Symbol,
    side: Order.Side === 'Long' ? 'BUY' : 'SELL',
    positionSide: 'BOTH',
    type: Order.OrderType === 'Limit' ? 'LIMIT' : 'MARKET',
    reduceOnly: false
  }

  let SLOrderSettings = {
    symbol: Order.Symbol,
    side: Order.Side === 'Long' ? 'SELL' : 'BUY',
    positionSide: 'BOTH',
    type: 'STOP_MARKET',
    timeInForce: 'GTE_GTC',
    reduceOnly: true,
    workingType: Order.SLOrder.WorkingType === 'Mark' ? 'MARK_PRICE' : 'CONTRACT_PRICE'
  }

  let TPOrderSettings = {
    symbol: Order.Symbol,
    side: Order.Side === 'Long' ? 'SELL' : 'BUY',
    positionSide: 'BOTH',
    type: 'TAKE_PROFIT_MARKET',
    timeInForce: 'GTE_GTC',
    reduceOnly: true,
    workingType: Order.SLOrder.WorkingType === 'Mark' ? 'MARK_PRICE' : 'CONTRACT_PRICE'
  }

  // Limit Order
  if (Order.OrderType === 'Limit') {
    // Set price to last
    if (Order.Price === -1) {
      await UpdateLastPrice()
      Order.Price = LastPrice
    }

    let StepSize = Filters.find((Filter) => {
      return Filter.filterType === 'LOT_SIZE'
    }).stepSize

    Quantity = Order.Size / Order.Price
    Quantity = RoundStep(Quantity, StepSize)
    MainOrderSettings.price = Order.Price
  } else {
    // Market Order
    await UpdateMarkPrice()

    let StepSize = Filters.find((Filter) => {
      return Filter.filterType === 'MARKET_LOT_SIZE'
    }).stepSize

    Quantity = Order.Size / MarkPrice
    Quantity = RoundStep(Quantity, StepSize)
  }

  MainOrderSettings.quantity = Quantity
  SLOrderSettings.quantity = Quantity
  TPOrderSettings.quantity = Quantity

  // Check TP/SL Orders Percent Mode
  let TickSize = Filters.find((Filter) => {
    return Filter.filterType === 'PRICE_FILTER'
  }).tickSize

  if (Order.TPOrder.PercentMode) {
    if (Order.TPOrder.WorkingType === 'Mark') {
      await UpdateMarkPrice()
      TPOrderSettings.stopPrice = MarkPrice * (1 + Order.TPOrder.Price / 100)
    } else {
      await UpdateLastPrice()
      TPOrderSettings.stopPrice = LastPrice * (1 + Order.TPOrder.Price / 100)
    }
  } else {
    TPOrderSettings.stopPrice = Order.TPOrder.Price
  }

  TPOrderSettings.stopPrice = RoundStep(TPOrderSettings.stopPrice, TickSize)

  if (Order.SLOrder.PercentMode) {
    if (Order.SLOrder.WorkingType === 'Mark') {
      await UpdateMarkPrice()
      SLOrderSettings.stopPrice = MarkPrice * (1 - Order.SLOrder.Price / 100)
    } else {
      await UpdateLastPrice()
      SLOrderSettings.stopPrice = LastPrice * (1 - Order.SLOrder.Price / 100)
    }
  } else {
    SLOrderSettings.stopPrice = Order.SLOrder.Price
  }
  SLOrderSettings.stopPrice = RoundStep(SLOrderSettings.stopPrice, TickSize)

  console.log(MainOrderSettings)
  console.log(SLOrderSettings)
  console.log(TPOrderSettings)

  // try {
  let MOrder = await Binance.Client.futuresOrder(MainOrderSettings)
  if (MOrder.orderId) MOrderId = MOrder.orderId
  else return { error: 'Main order error!' }

  if (Order.SLOrder.IsActive) {
    let SLOrder = await Binance.Client.futuresOrder(SLOrderSettings)
    if (SLOrder.orderId) SLOrderId = SLOrder.orderId
    else return { error: 'Stop loss order error! Please close take profit order manual.' }
  }

  if (Order.TPOrder.IsActive) {
    let TPOrder = await Binance.Client.futuresOrder(TPOrderSettings)
    if (TPOrder.orderId) TPOrderId = TPOrder.orderId
    else return { error: 'Take profit order error!' }
  }

  console.log(Order.Symbol, ' Orders Success')
  return { TPOrderId, SLOrderId, MOrderId: MOrder.orderId }
  // } catch (ex) {
  // }
}

// Cross1Order => Blue cross red
// Cross2Order => Red cross blue
module.exports.StartBot = async ({ Symbol, Interval, ConversionLength, BaseLength, Cross1Order, Cross2Order }) => {
  ExchangeInfo = (await Binance.GetExchangeInfo()).symbols
  if (Bots.some((bot) => bot.Symbol === Symbol)) {
    return { error: 'Symbol has bot' }
  }

  let Calculation = await Binance.StartCalculateIchimoku(Symbol, Interval, ConversionLength, BaseLength, (CrossType) => {
    if (CrossType === 1) {
      CreateBotOrder({ ...Cross1Order, Symbol })
    } else if (CrossType === 2) {
      CreateBotOrder({ ...Cross1Order, Symbol })
    }
  })

  Bots.push({ Symbol, Interval, ConversionLength, BaseLength, Cross1Order, Cross2Order, Calculation })
  return { result: true }
}

module.exports.GetBot = (Symbol, Interval) => {
  return Bots.find((Bot) => Bot.Symbol === Symbol && Bot.Interval === Interval)
}

module.exports.StopBot = (Symbol) => {
  let BotIndex = Bots.findIndex((Bot) => Bot.Symbol === Symbol)
  if (BotIndex === -1) return { error: 'Symbol has no bot.' }

  let Bot = Bots[BotIndex]
  Bot.Calculation.ConnectionClose()
  Bots.splice(BotIndex, 1)
  console.log('Bot stopped => ' + Bot.Symbol + ' ' + Bot.Interval)
  return { result: true }
}
