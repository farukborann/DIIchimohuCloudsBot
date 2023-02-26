import Api from '../Others/Api'
import React, { useState, useEffect } from 'react'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import Statistics from '../Components/Backtest/GeneralStatistics'
import OrderHistory from '../Components/Backtest/OrderHistory'
import CandlestickChart from '../Components/Backtest/CandlestickChart'
import Manager from '../Components/Backtest/Manager'
import GeneralTests from '../Components/Backtest/GeneralTests'

const T2BCrossDefault = {
  OrderType: 'Limit',
  Size: 100,
  Side: 'Short',
  MinSize: 0,
  TPOrder: {
    IsActive: true,
    Price: 2,
    PercentMode: true,
    WorkingType: 'Mark'
  },
  SLOrder: {
    IsActive: true,
    Price: 2,
    PercentMode: true,
    WorkingType: 'Mark'
  }
}

const B2TCrossDefault = {
  OrderType: 'Limit',
  Size: 100,
  Side: 'Long',
  MinSize: 0,
  TPOrder: {
    IsActive: true,
    Price: 2,
    PercentMode: true,
    WorkingType: 'Mark'
  },
  SLOrder: {
    IsActive: true,
    Price: 2,
    PercentMode: true,
    WorkingType: 'Mark'
  }
}

const Page = () => {
  const [ExchangeInfo, SetExchangeInfo] = useState([])
  const [SelectedPair, SetSelectedPair] = useState('BTCUSDT')
  const [SelectedInterval, SetSelectedInterval] = useState('1m')
  const [IndicatorValues, SetIndicatorValues] = useState({ CLL: 9, BLL: 26 })
  const [T2BCross, SetT2BCross] = useState(T2BCrossDefault)
  const [StartDate, SetStartDate] = useState()
  const [EndDate, SetEndDate] = useState()
  const [B2TCross, SetB2TCross] = useState(B2TCrossDefault)
  const [Updater, SetUpdater] = useState(false)
  const [Result, SetResult] = useState()

  useEffect(() => {
    Api.GetExchangeInfo().then((ExchangeInfo) => {
      SetExchangeInfo(ExchangeInfo.symbols.map((Symbol) => Symbol))
    })
    SetUpdater(true)
  }, [])

  return (
    <>
      <div className="float-left m-5">
        <PairList
          className="float-left border-2 border-gray-300  outline-none"
          SelectedPair={SelectedPair}
          SetSelectedPair={SetSelectedPair}
          Updater={Updater}
          SetUpdater={SetUpdater}
          ExchangeInfo={ExchangeInfo}
        />
        <div className="float-left">
          <div className="float-left w-fit h-fit">
            <Manager
              SelectedPair={SelectedPair}
              SelectedInterval={SelectedInterval}
              T2BCross={T2BCross}
              B2TCross={B2TCross}
              StartDate={StartDate}
              EndDate={EndDate}
              IndicatorValues={IndicatorValues}
              SetResult={SetResult}
              SetT2BCross={SetT2BCross}
              SetB2TCross={SetB2TCross}
              SetStartDate={SetStartDate}
              SetEndDate={SetEndDate}
              SetIndicatorValues={SetIndicatorValues}
              className="float-left w-[810px] h-fit"
            />
            <div className="float-left w-fit h-fit">
              <IntervalList
                className="border-2 border-gray-300 h-fit outline-none"
                SelectedInterval={SelectedInterval}
                SetSelectedInterval={SetSelectedInterval}
              />
              <br></br>
              <GeneralTests
                SelectedPair={SelectedPair}
                SelectedInterval={SelectedInterval}
                T2BCross={T2BCross}
                B2TCross={B2TCross}
                StartDate={StartDate}
                EndDate={EndDate}
                IndicatorValues={IndicatorValues}
                SetResult={SetResult}
                SetSelectedInterval={SetSelectedInterval}
              />
            </div>
          </div>
          <br></br>
          <div className="float-left w-fit h-fit">
            <CandlestickChart
              className="float-left border-2 border-gray-300"
              height={500}
              width={1100}
              SelectedPair={SelectedPair}
              SelectedInterval={SelectedInterval}
              Result={Result}
            />
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
