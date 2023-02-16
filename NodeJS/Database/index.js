const Mongoose = require('mongoose') // Terminal logging
const Orders = require('./Models/Orders') // Terminal logging

module.exports.Main = async () => {
  try {
    Mongoose.set('strictQuery', true)
    await Mongoose.connect('mongodb://127.0.0.1:27017/di_ichimohu')
    console.log('Database Connection Successful.')
  } catch (ex) {
    console.log('Database Connection Failed !!!')
  }
}

module.exports.AddOrder = async (BotId, OrderId, Symbol, Side, Size, StopPrice, TakeProfitPrice) => {
  let Order = await Orders.create({ BotId, OrderId, Symbol, Side, Size, StopPrice, TakeProfitPrice })
  console.log('Database Added => ', { OrderId, Symbol, Side, Size, StopPrice, TakeProfitPrice })
  return Order
}

module.exports.EndOrder = async (BotId, Side, RealizedProfit) => {
  console.log(BotId, Side, RealizedProfit)

  let Order = await Orders.findOne({ BotId, Side }, {}, { sort: { createdAt: -1 } })
  if (!Order || Order.ClosedDate) return

  let Result = await Orders.findOneAndUpdate(
    { BotId, Side },
    { RealizedProfit, ClosedDate: new Date() },
    {
      upsert: true,
      sort: { createdAt: -1 }
    }
  )
  return Result
}

module.exports.GetGeneralStatistics = async (Symbol) => {
  let _Orders = await Orders.find({ Symbol })
  let OrderCount = 0,
    ResultedOrderCount = 0,
    ProfitedOrderCount = 0,
    LossedOrderCount = 0,
    RealizedProfitsSum = 0

  OrderCount = _Orders.length
  ResultedOrders = _Orders.filter((order) => order.RealizedProfit)
  ResultedOrderCount = ResultedOrders.length
  ProfitedOrderCount = ResultedOrders.filter((order) => order.RealizedProfit > 0).length
  LossedOrderCount = ResultedOrders.filter((order) => order.RealizedProfit < 0).length
  ResultedOrders.forEach((order) => {
    RealizedProfitsSum += order.RealizedProfit
  })

  return { OrderCount, ResultedOrderCount, ProfitedOrderCount, LossedOrderCount, RealizedProfitsSum }
}

module.exports.GetLast20Order = async (Symbol) => {
  let _Orders = await Orders.find({ Symbol }).limit(20).lean()
  return _Orders
}
