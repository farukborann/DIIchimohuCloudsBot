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

module.exports.DedectIndicatorCrossing = (line1, line2) => {
  let line1_1, line2_1
  let line1_2 = line1.at(-1)
  let line2_2 = line2.at(-1)

  let i = line1.length - 2
  let j = line2.length - 2
  for (; !(i < 0 || j < 0); i--, j--) {
    console.log('first')
    if (line1[i] !== line2[j]) {
      line1_1 = line1[i]
      line2_1 = line2[j]
      break
    }
  }

  console.log(line1_1, line2_1, line1_2, line2_2)
  if (!line1_1 || !line2_1 || !line1_2 || !line2_2) return 0

  if (line1_1 > line2_1 && line1_2 < line2_2) return 1
  else if (line1_1 < line2_1 && line1_2 > line2_2) return 2
  else return 0
}
