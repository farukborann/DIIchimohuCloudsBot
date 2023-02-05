const Mongoose = require('mongoose')
const Schema = Mongoose.Schema
// const { softDeletePlugin } = require('soft-delete-plugin-mongoose')

const Order = Schema(
  {
    OrderId: {
      type: String,
      required: true
    },
    Symbol: {
      type: String,
      required: true
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

// Module.plugin(softDeletePlugin)

const Modules = Mongoose.model('Orders', Order)
module.exports = Modules
