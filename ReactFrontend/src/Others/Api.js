import axios from 'axios'
const BaseUrl = 'http://127.0.0.1:4000/api'

const GetIchimoku = async (Symbol, Interval) => {
  let result = await axios.post(BaseUrl + '/charts/get_chart', { Symbol, Interval })
  return result.data
}

const GetExchangeInfo = async () => {
  let result = await axios.get(BaseUrl + '/binance/exchange_info')
  return result.data
}

const StartBot = async (data) => {
  let result = await axios.post(BaseUrl + '/bots/start', data)
  return result.data
}

const GetAllBots = async () => {
  let result = await axios.get(BaseUrl + '/bots/all')
  return result.data
}

const GetSymbolSettings = async (data) => {
  let result = await axios.post(BaseUrl + '/binance/get_symbol_settings', data)
  return result.data
}

const SetSymbolSettings = async (data) => {
  let result = await axios.post(BaseUrl + '/binance/set_symbol_settings', data)
  return result.data
}

const StopBot = async (data) => {
  let result = await axios.post(BaseUrl + '/bots/stop', data)
  return result.data
}

const GetLogs = async () => {
  let result = await axios.get(BaseUrl + '/bots/logs')
  return result.data
}

const GetSymbolPrice = async (data) => {
  let result = await axios.post(BaseUrl + '/binance/get_symbol_price', data)
  return result.data
}

const GetGeneralStatistics = async (data) => {
  let result = await axios.post(BaseUrl + '/database/get_general_statistics', data)
  return result.data
}

const GetLast20Order = async (data) => {
  let result = await axios.post(BaseUrl + '/database/get_last_orders', data)
  return result.data
}

export default {
  GetExchangeInfo,
  GetIchimoku,
  StartBot,
  GetAllBots,
  StopBot,
  GetLogs,
  GetSymbolSettings,
  SetSymbolSettings,
  GetSymbolPrice,
  GetGeneralStatistics,
  GetLast20Order
}
