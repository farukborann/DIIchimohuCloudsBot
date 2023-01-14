const GetRealPrice = (price, divide) => {
  let k
  if (price < 51) k = 0
  else if (price < 101) k = 2
  else if (price < 201) k = 1
  else if (price < 401) k = 0.8
  else if (price < 701) k = 0.7
  else if (price < 1001) k = 0.6
  else if (price < 1201) k = 0.5
  else k = 0.4

  let newPrice = (2 * price * (k + 1)) / 0.85 / divide
  newPrice = Math.round(newPrice * 10) / 10
  return newPrice
}

module.exports = GetRealPrice
