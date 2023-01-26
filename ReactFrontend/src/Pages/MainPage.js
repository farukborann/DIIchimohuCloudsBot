import { useState, useEffect } from 'react'
import CandlestickChart from '../Components/CandlestickChart'
import UpdateChartButton from '../Components/CandlestickChart/UpdateChartButton'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import BotManger from '../Components/BotManger'
import BotsList from '../Components/BotsList'
import BotsLogs from '../Components/BotsLogs'

const Page = () => {
  const [SelectedPair, SetSelectedPair] = useState('BTCUSDT')
  const [SelectedInterval, SetSelectedInterval] = useState('1m')
  const [Bots, SetBots] = useState([])

  const [Updater, SetUpdater] = useState(false)
  const AutoUpdate = () => {
    SetUpdater(true)
    setTimeout(() => {
      AutoUpdate()
    }, (61 - new Date().getSeconds()) * 1000)
  }
  useEffect(() => {
    AutoUpdate()
  }, [])

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
              Updater={Updater}
              SetUpdater={SetUpdater}
            />
            <div className="float-left">
              <IntervalList className="border-2 border-gray-300 h-fit outline-none" SelectedInterval={SelectedInterval} SetSelectedInterval={SetSelectedInterval} />
              <br></br>
              <UpdateChartButton SetUpdater={SetUpdater} />
            </div>
            <BotsList
              Updater={Updater}
              SetUpdater={SetUpdater}
              SetSelectedPair={SetSelectedPair}
              SetSelectedInterval={SetSelectedInterval}
              Bots={Bots}
              SetBots={SetBots}
              className="float-left w-[810px] h-[515px]"
            />
          </div>
          <br></br>
          <div className="float-left">
            <BotManger className="float-left w-[810px] h-fit" SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} SetUpdater={SetUpdater} Bots={Bots} />
            <div className="float-left w-[810px] h-fit">
              <BotsLogs className="float-left w-[810px] h-[515px] flex flex-col" Updater={Updater} SetUpdater={SetUpdater} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
