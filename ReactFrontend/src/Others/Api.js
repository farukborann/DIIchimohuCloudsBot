import axios from 'axios'
const BaseUrl = 'http://127.0.0.1:4000'

const GetIchimoku = async (symbol, interval) => {
  let result = await axios.post(BaseUrl + '/charts/get_chart', { symbol, interval })
  return result.data
}

const GetExchangeInfo = async () => {
  let result = await axios.get(BaseUrl + '/binance/exchange_info')
  return result.data
}

export default {
  GetExchangeInfo,
  GetIchimoku
}
