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

module.exports.DedectAllCrosses = (line1, line2) => {
  let LastStatue = 0
}

module.exports.RoundStep = (Quantity, StepSize) => {
  // Integers do not require rounding
  if (Number.isInteger(Quantity)) return Quantity
  const qtyString = parseFloat(Quantity).toFixed(16)
  const desiredDecimals = Math.max(StepSize.indexOf('1') - 1, 0)
  const decimalIndex = qtyString.indexOf('.')
  return parseFloat(qtyString.slice(0, decimalIndex + desiredDecimals + 1))
}
