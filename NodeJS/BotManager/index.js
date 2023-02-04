const Binance = require('../Binance/')
const Database = require('../Database')
const { RoundStep } = require('../Binance/Helpers')

let Bots = []
let Logs = []
let ExchangeInfo
module.exports.Bots = Bots
module.exports.Logs = Logs

const CancelOrders = async (Symbol) => {
  console.log('Orders Cancelling')
  let SymbolOrder = (await Binance.Client.futuresPositionRisk({ symbol: Symbol }))[0]
  if (SymbolOrder.entryPrice !== '0.0') {
    let CancelOrder = {
      symbol: Symbol,
      side: SymbolOrder.positionAmt.startsWith('-') ? 'BUY' : 'SELL',
      reduceOnly: true,
      type: 'MARKET',
      positionSide: 'BOTH',
      quantity: SymbolOrder.positionAmt.replace('-', '')
    }
    await Binance.Client.futuresOrder(CancelOrder)
    await Binance.Client.futuresCancelAllOpenOrders({ symbol: Symbol })
  }
}

const CreateBotOrder = async (Order) => {
  let Quantity, LastPrice, MarkPrice

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
  // NewOrders.push(MainOrderSettings)

  let SLOrderSettings, TPOrderSettings

  // For Check TP/SL Orders Percent Mode
  let TickSize = Filters.find((Filter) => {
    return Filter.filterType === 'PRICE_FILTER'
  }).tickSize

  if (Order.SLOrder.IsActive) {
    SLOrderSettings = {
      symbol: Order.Symbol,
      side: Order.Side === 'Long' ? 'SELL' : 'BUY',
      positionSide: 'BOTH',
      type: 'STOP_MARKET',
      timeInForce: 'GTE_GTC',
      reduceOnly: true,
      quantity: Quantity,
      workingType: Order.SLOrder.WorkingType === 'Mark' ? 'MARK_PRICE' : 'CONTRACT_PRICE'
    }

    if (Order.SLOrder.PercentMode) {
      if (Order.SLOrder.WorkingType === 'Mark') {
        await UpdateMarkPrice()
        if (Order.Side === 'Long') {
          SLOrderSettings.stopPrice = MarkPrice * (1 - Order.SLOrder.Price / 100)
        } else {
          SLOrderSettings.stopPrice = MarkPrice * (1 + Order.SLOrder.Price / 100)
        }
      } else {
        await UpdateLastPrice()
        if (Order.Side === 'Long') {
          SLOrderSettings.stopPrice = MarkPrice * (1 - Order.SLOrder.Price / 100)
        } else {
          SLOrderSettings.stopPrice = MarkPrice * (1 + Order.SLOrder.Price / 100)
        }
      }
    } else {
      SLOrderSettings.stopPrice = Order.SLOrder.Price
    }
    SLOrderSettings.stopPrice = RoundStep(SLOrderSettings.stopPrice, TickSize)
  }

  if (Order.TPOrder.IsActive) {
    TPOrderSettings = {
      symbol: Order.Symbol,
      side: Order.Side === 'Long' ? 'SELL' : 'BUY',
      positionSide: 'BOTH',
      type: 'TAKE_PROFIT_MARKET',
      timeInForce: 'GTE_GTC',
      reduceOnly: true,
      quantity: Quantity,
      workingType: Order.SLOrder.WorkingType === 'Mark' ? 'MARK_PRICE' : 'CONTRACT_PRICE'
    }

    if (Order.TPOrder.PercentMode) {
      if (Order.TPOrder.WorkingType === 'Mark') {
        await UpdateMarkPrice()
        if (Order.Side === 'Long') {
          TPOrderSettings.stopPrice = MarkPrice * (1 + Order.TPOrder.Price / 100)
        } else {
          TPOrderSettings.stopPrice = MarkPrice * (1 - Order.TPOrder.Price / 100)
        }
      } else {
        await UpdateLastPrice()
        if (Order.Side === 'Long') {
          TPOrderSettings.stopPrice = MarkPrice * (1 + Order.TPOrder.Price / 100)
        } else {
          TPOrderSettings.stopPrice = MarkPrice * (1 - Order.TPOrder.Price / 100)
        }
      }
    } else {
      TPOrderSettings.stopPrice = Order.TPOrder.Price
    }

    TPOrderSettings.stopPrice = RoundStep(TPOrderSettings.stopPrice, TickSize)
  }

  // let LastOrders = await Binance.Client.futuresBatchOrders({ batchOrders: NewOrders })

  let Orders = {}
  Orders.MOrder = await Binance.Client.futuresOrder(MainOrderSettings)
  // if (MOrder.orderId) MOrderId = MOrder.orderId
  // else return { error: 'Main order error!' }

  if (Order.SLOrder.IsActive) {
    Orders.SLOrder = await Binance.Client.futuresOrder(SLOrderSettings)
    // if (SLOrder.orderId) SLOrderId = SLOrder.orderId
    // else return { error: 'Stop loss order error! Please close take profit order manual.' }
  }

  if (Order.TPOrder.IsActive) {
    Orders.TPOrder = await Binance.Client.futuresOrder(TPOrderSettings)
    // if (TPOrder.orderId) TPOrderId = TPOrder.orderId
    // else return { error: 'Take profit order error!' }
  }

  console.log(Order.Symbol, ' Orders Success')
  return {
    Quantity: MainOrderSettings.quantity,
    Side: MainOrderSettings.side,
    LastOrderds: Orders
  }
}

// Cross1Order => Blue cross red
// Cross2Order => Red cross blue
module.exports.StartBot = async ({ Symbol, Interval, ConversionLength, BaseLength, Cross1Order, Cross2Order }) => {
  ExchangeInfo = (await Binance.GetExchangeInfo()).symbols
  if (Bots.some((bot) => bot.Symbol === Symbol)) {
    return { error: 'Symbol has bot' }
  }

  let Calculation = await Binance.StartCalculateIchimoku(Symbol, Interval, ConversionLength, BaseLength, async (CrossType) => {
    let Bot = Bots.find((Bot) => {
      return Bot.Symbol === Symbol
    })

    await CancelOrders(Symbol)
    // Wait for filling cancel order
    await new Promise((resolve) => setTimeout(resolve, 200))
    if (CrossType === 1) {
      let LastOrders = await CreateBotOrder({ ...Cross1Order, Symbol })

      await Database.AddOrder(Symbol, LastOrders.LastOrderds.MOrder.orderId)
      Bot.LastOrders = LastOrders

      let Now = new Date()
      Bot.Logs.push({ Date: Now, Cross: 1 })
      Logs.push({ Symbol, Date: Now, Cross: 1 })
    } else if (CrossType === 2) {
      let LastOrders = await CreateBotOrder({ ...Cross2Order, Symbol })

      await Database.AddOrder(Symbol, LastOrders.LastOrderds.MOrder.orderId)
      Bot.LastOrders = LastOrders

      let Now = new Date()
      Bot.Logs.push({ Date: Now, Cross: 2 })
      Logs.push({ Symbol, Date: Now, Cross: 2 })
    }
  })

  Bots.push({ Symbol, Interval, ConversionLength, BaseLength, Cross1Order, Cross2Order, Calculation, Logs: [] })
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

module.exports.Main = async () => {
  await Binance.Client.ws.futuresUser((event) => {
    if (event.eventType === 'ORDER_TRADE_UPDATE' && event.orderStatus === 'FILLED' && event.isReduceOnly === true) {
      Database.EndOrder(event.orderId, parseFloat(event.realizedProfit))
    }
  })
  // console.log(await Database.GetGeneralStatistics('ADAUSDT'))
  // console.log(await Database.GetLast20Order('ADAUSDT'))
}
