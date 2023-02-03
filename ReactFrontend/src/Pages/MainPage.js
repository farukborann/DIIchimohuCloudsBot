import Api from '../Others/Api'
import React, { useState, useEffect } from 'react'
import CandlestickChart from '../Components/CandlestickChart'
import UpdateChartButton from '../Components/CandlestickChart/UpdateButton'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import BotManger from '../Components/BotManger'
import BotsList from '../Components/BotsList'
import BotsLogs from '../Components/BotsLogs'
import SymbolSettings from '../Components/SymbolSettings'

const Page = () => {
  const [ExchangeInfo, SetExchangeInfo] = useState([])
  const [SelectedPair, SetSelectedPair] = useState('BTCUSDT')
  const [SelectedInterval, SetSelectedInterval] = useState('1m')
  const [Bots, SetBots] = useState([])

  const [ManuelUpdater, SetManuelUpdater] = useState(false)
  const [AutoUpdater, SetAutoUpdater] = useState(false)
  const AutoUpdate = () => {
    SetAutoUpdater(true)
    setTimeout(() => {
      AutoUpdate()
    }, (61 - new Date().getSeconds()) * 1000)
  }
  useEffect(() => {
    AutoUpdate()
    Api.GetExchangeInfo().then((ExchangeInfo) => {
      SetExchangeInfo(ExchangeInfo.symbols.map((Symbol) => Symbol))
    })
  }, [])

  useEffect(() => {
    SetAutoUpdater(true)
  }, [ManuelUpdater])

  return (
    <>
      <div className="float-left m-5">
        <PairList className="float-left border-2 border-gray-300  outline-none" SelectedPair={SelectedPair} SetSelectedPair={SetSelectedPair} />
        <div className="float-left">
          <div className="float-left w-fit h-fit">
            <CandlestickChart
              className="float-left border-2 border-gray-300"
              height={500}
              width={750}
              SelectedPair={SelectedPair}
              SelectedInterval={SelectedInterval}
              Updater={AutoUpdater}
              SetUpdater={SetAutoUpdater}
            />
            <div className="float-left">
              <IntervalList className="border-2 border-gray-300 h-fit outline-none" SelectedInterval={SelectedInterval} SetSelectedInterval={SetSelectedInterval} />
              <br></br>
              <UpdateChartButton SetUpdater={SetManuelUpdater} />
            </div>
            <BotsList
              Updater={AutoUpdater}
              SetUpdater={SetAutoUpdater}
              SetSelectedPair={SetSelectedPair}
              SetSelectedInterval={SetSelectedInterval}
              Bots={Bots}
              SetBots={SetBots}
              className="float-left w-[810px] h-[515px]"
            />
          </div>
          <br></br>
          <div className="float-left h-auto">
            <BotManger className="float-left w-[810px] h-fit" SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} SetUpdater={SetAutoUpdater} Bots={Bots} />
            <div className="float-left w-[810px] h-auto">
              <BotsLogs className="float-left w-[810px] h-[545px] flex flex-col" Updater={AutoUpdater} />
            </div>
          </div>
          <br></br>
          <div className="float-left">
            <SymbolSettings className="float-left w-fit h-fit" SelectedPair={SelectedPair} Updater={ManuelUpdater} SetUpdater={SetManuelUpdater} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
