const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const Order = Schema(
  {
    BotId: {
      type: String,
      required: true
    },
    OrderId: {
      type: String,
      required: true
    },
    Symbol: {
      type: String,
      required: true
    },
    Interval: {
      type: String
    },
    IndicatorSettings: {
      type: String
    },
    Side: {
      type: String
    },
    Size: {
      type: Number
    },
    StopPrice: {
      type: Number
    },
    TakeProfitPrice: {
      type: Number
    },
    RealizedProfit: {
      type: Number
    },
    ClosedDate: {
      type: Date
    }
  },
  { timestamps: true }
)

const Modules = Mongoose.model('Orders', Order)
module.exports = Modules
