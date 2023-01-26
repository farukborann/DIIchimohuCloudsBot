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

module.exports.DedectIndicatorCrossing = (line1_1, line1_2, line2_1, line2_2) => {
  if ((line1_1 > line2_1 || line1_1 === line2_1) && line1_2 < line2_2) return 1
  else if ((line1_1 < line2_1 || line1_1 === line2_1) && line1_2 > line2_2) return 2
  else return 0
}
