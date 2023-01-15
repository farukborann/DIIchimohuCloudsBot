import axios from 'axios'
const BinanceBaseUrl = 'http://127.0.0.1:4000/binance'

const GetKlines = async (symbol, interval) => {
  let result = await axios.post(BinanceBaseUrl + '/public/klines', { symbol, interval })
  return result.data
}

const GetIchimoku = async (symbol, interval) => {
  let result = await axios.post(BinanceBaseUrl + '/indicators/ichimoku', { symbol, interval })
  return result.data
}

const GetExchangeInfo = async () => {
  let result = await axios.get(BinanceBaseUrl + '/public/exchangeInfo')
  return result.data
}

export default {
  GetKlines,
  GetExchangeInfo,
  GetIchimoku
}
