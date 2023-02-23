import Api from '../Others/Api'
import React, { useState, useEffect } from 'react'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import Statistics from '../Components/Backtest/GeneralStatistics'
import OrderHistory from '../Components/Backtest/OrderHistory'
import CandlestickChart from '../Components/Backtest/CandlestickChart'
import Manager from '../Components/Backtest/Manager'
import DownloadButton from '../Components/Backtest/DownloadButton'

const Page = () => {
  const [ExchangeInfo, SetExchangeInfo] = useState([])
  const [SelectedPair, SetSelectedPair] = useState('BTCUSDT')
  const [SelectedInterval, SetSelectedInterval] = useState('1m')
  const [Result, SetResult] = useState()

  useEffect(() => {
    Api.GetExchangeInfo().then((ExchangeInfo) => {
      SetExchangeInfo(ExchangeInfo.symbols.map((Symbol) => Symbol))
    })
  }, [])

  return (
    <>
      <div className="float-left m-5">
        <PairList className="float-left border-2 border-gray-300  outline-none" SelectedPair={SelectedPair} SetSelectedPair={SetSelectedPair} ExchangeInfo={ExchangeInfo} />
        <div className="float-left">
          <div className="float-left w-fit h-fit">
            <Manager className="float-left w-[810px] h-fit" SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} SetResult={SetResult} />
            <div className="float-left w-fit h-fit">
              <IntervalList className="border-2 border-gray-300 h-fit outline-none" SelectedInterval={SelectedInterval} SetSelectedInterval={SetSelectedInterval} />
              <br></br>
              <DownloadButton Result={Result} SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} />
            </div>
          </div>
          <br></br>
          <div className="float-left w-fit h-fit">
            <CandlestickChart className="float-left border-2 border-gray-300" height={500} width={1100} SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} Result={Result} />
          </div>
          <br></br>
          <div className="float-left w-fit h-fit">
            <Statistics Result={Result} height={400} width={1000} />
          </div>
          <br></br>
          <div className="float-left h-auto">
            <OrderHistory Result={Result} />
          </div>
          <br></br>
        </div>
      </div>
    </>
  )
}

export default Page
