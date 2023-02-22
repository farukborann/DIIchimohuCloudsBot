// line1   .    .
//          . .
//           .
//         .  .
// line2 .     .
//
// line1 cross line2

//  0 => no crossing
//  1 => line1 cross line2
//  2 => line2 cross line1

// Last Statue
//  0 => Equal
//  1 => line1 high
//  2 => line2 high

module.exports.DedectAllCrosses = (Klines, StartIndex) => {
  // What is indicator status
  for (let i = StartIndex; i < Klines.length; i++) {
    if (Klines[i].conversionValue < Klines[i].baseValue) {
      Klines[i].indicatorStatus = 1 // Conversion higher than Base
    } else if (Klines[i].conversionValue > Klines[i].baseValue) {
      Klines[i].indicatorStatus = 2 // Base higher than Conversion
    } else {
      Klines[i].indicatorStatus = 0 // Equal
    }
  }

  // Where is line crosses
  let CrossesCount = 0
  let LastStatus = Klines[StartIndex].indicatorStatus
  for (let i = StartIndex + 1; i < Klines.length; i++) {
    if (Klines[i].indicatorStatus !== 0 && Klines[i].indicatorStatus !== LastStatus) {
      Klines[i].isCrossing = true
      LastStatus = Klines[i].indicatorStatus
      CrossesCount++
    }
  }

  return { CrossesCount }
}

module.exports.RoundStep = (Quantity, StepSize) => {
  // Integers do not require rounding
  if (Number.isInteger(Quantity)) return Quantity
  const qtyString = parseFloat(Quantity).toFixed(16)
  const desiredDecimals = Math.max(StepSize.indexOf('1') - 1, 0)
  const decimalIndex = qtyString.indexOf('.')
  return parseFloat(qtyString.slice(0, decimalIndex + desiredDecimals + 1))
}

module.exports.CalculateOrders = (Klines, Cross1Order, Cross2Order) => {
  // Calculate Orders
  // const Cross1Order = {
  //   Size: 1700,
  //   Side: 'Short',
  //   TPOrder: {
  //     IsActive: true,
  //     Price: 1,
  //     PercentMode: true
  //   },
  //   SLOrder: {
  //     IsActive: true,
  //     Price: 1,
  //     PercentMode: true
  //   }
  // }
  // const Cross2Order = {
  //   Size: 1700,
  //   Side: 'Long',
  //   TPOrder: {
  //     IsActive: true,
  //     Price: 1,
  //     PercentMode: true
  //   },
  //   SLOrder: {
  //     IsActive: true,
  //     Price: 1,
  //     PercentMode: true
  //   }
  // }

  let LastOrder,
    AllOrders = []

  const SetLastOrderPercentModeAndLastPrice = (Price) => {
    LastOrder.Price = Price
    if (LastOrder.TPOrder.PercentMode) {
      if (LastOrder.Side === 'Long') {
        LastOrder.TPOrder.Price = Price * (1 + LastOrder.TPOrder.Price / 100)
      } else {
        LastOrder.TPOrder.Price = Price * (1 - LastOrder.TPOrder.Price / 100)
      }
    }

    if (LastOrder.SLOrder.PercentMode) {
      if (LastOrder.Side === 'Long') {
        LastOrder.SLOrder.Price = Price * (1 - LastOrder.SLOrder.Price / 100)
      } else {
        LastOrder.SLOrder.Price = Price * (1 + LastOrder.SLOrder.Price / 100)
      }
    }
  }

  for (let i = 0; i < Klines.length; i++) {
    if (LastOrder && LastOrder.TPOrder.IsActive) {
      if (LastOrder.Side === 'Long' && Klines[i].close > LastOrder.TPOrder.Price) {
        // Trigger Take Profit
        let Rate = LastOrder.TPOrder.Price / LastOrder.Price - 1
        let Profit = Rate * LastOrder.Size

        AllOrders.push({ ...LastOrder, Profit, CloseType: 'Take Profit', CloseDate: Klines[i].closeTime })
        LastOrder = undefined
      } else if (LastOrder.Side === 'Short' && Klines[i].close < LastOrder.TPOrder.Price) {
        // Trigger Take Profit
        let Rate = 1 - LastOrder.TPOrder.Price / LastOrder.Price
        let Profit = Rate * LastOrder.Size

        AllOrders.push({ ...LastOrder, Profit, CloseType: 'Take Profit', CloseDate: Klines[i].closeTime })
        LastOrder = undefined
      }
    }

    if (LastOrder && LastOrder.SLOrder.IsActive) {
      if (LastOrder.Side === 'Long' && Klines[i].close < LastOrder.SLOrder.Price) {
        // Trigger Stop Loss
        let Rate = LastOrder.SLOrder.Price / LastOrder.Price - 1
        let Profit = Rate * LastOrder.Size

        AllOrders.push({ ...LastOrder, Profit, CloseType: 'Stop Loss', CloseDate: Klines[i].closeTime })
        LastOrder = undefined
      } else if (LastOrder.Side === 'Short' && Klines[i].close > LastOrder.SLOrder.Price) {
        // Trigger Stop Loss
        let Rate = 1 - LastOrder.SLOrder.Price / LastOrder.Price
        let Profit = Rate * LastOrder.Size

        AllOrders.push({ ...LastOrder, Profit, CloseType: 'Stop Loss', CloseDate: Klines[i].closeTime })
        LastOrder = undefined
      }
    }

    if (Klines[i].isCrossing) {
      if (LastOrder) {
        // Close Manually
        if (LastOrder.Side === 'Long') {
          if (Klines[i].close > LastOrder.Price) {
            // Get Higher
            let Rate = Klines[i].close / LastOrder.Price - 1
            let Profit = Rate * LastOrder.Size

            AllOrders.push({ ...LastOrder, Profit, CloseType: 'Manual', ClosePrice: Klines[i].close, CloseDate: Klines[i].closeTime })
          } else {
            let Rate = Klines[i].close / LastOrder.Price - 1
            let Profit = Rate * LastOrder.Size

            AllOrders.push({ ...LastOrder, Profit, CloseType: 'Manual', ClosePrice: Klines[i].close, CloseDate: Klines[i].closeTime })
          }
        } else {
          if (Klines[i].close > LastOrder.Price) {
            // Get Higher
            let Rate = 1 - Klines[i].close / LastOrder.Price
            let Profit = Rate * LastOrder.Size

            AllOrders.push({ ...LastOrder, Profit, CloseType: 'Manual', ClosePrice: Klines[i].close, CloseDate: Klines[i].closeTime })
          } else {
            let Rate = 1 - Klines[i].close / LastOrder.Price
            let Profit = Rate * LastOrder.Size

            AllOrders.push({ ...LastOrder, Profit, CloseType: 'Manual', ClosePrice: Klines[i].close, CloseDate: Klines[i].closeTime })
          }
        }

        LastOrder = undefined
      }

      // New Order
      LastOrder = Klines[i].indicatorStatus === 1 ? JSON.parse(JSON.stringify(Cross1Order)) : Klines[i].indicatorStatus === 2 ? JSON.parse(JSON.stringify(Cross2Order)) : undefined
      LastOrder.OpenDate = Klines[i].openTime
      SetLastOrderPercentModeAndLastPrice(Klines[i].close)
    }
  }

  let TotalProfit = 0
  AllOrders.forEach((Order) => {
    TotalProfit += Order.Profit
  })

  return { AllOrders, TotalProfit }
}
