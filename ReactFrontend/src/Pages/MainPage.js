import { useState, useEffect } from 'react'
import CandlestickChart from '../Components/CandlestickChart/CandlestickChart'
import UpdateChartButton from '../Components/CandlestickChart/UpdateChartButton'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import BotManger from '../Components/BotManger/BotManager'

const Page = () => {
  const [SelectedPair, SetSelectedPair] = useState('')
  const [SelectedInterval, SetSelectedInterval] = useState('')

  const [ChartUpdater, SetChartUpdater] = useState(false)
  const AutoChartUpdater = () => {
    SetChartUpdater(true)
    setTimeout(() => {
      AutoChartUpdater()
    }, (60 - new Date().getSeconds()) * 1000)
  }
  useEffect(() => {
    AutoChartUpdater()
  }, [])

  return (
    <>
      <div className="float-left m-5">
        <PairList className="float-left border-2 border-gray-300 h-screen outline-none" SetSelectedPair={SetSelectedPair} />
        <div className="float-left w-fit h-fit">
          <CandlestickChart
            className="float-left border-2 border-gray-300"
            height={500}
            width={750}
            SelectedPair={SelectedPair}
            SelectedInterval={SelectedInterval}
            Updater={ChartUpdater}
            SetUpdater={SetChartUpdater}
          />
          <div className="float-left">
            <IntervalList className="border-2 border-gray-300 h-fit outline-none" SetSelectedInterval={SetSelectedInterval} />
            <br></br>
            <UpdateChartButton SetChartUpdater={SetChartUpdater} />
          </div>
        </div>
        <br></br>
        <BotManger className="float-left w-[810px] h-fit" SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} SetChartUpdater={SetChartUpdater} />
      </div>
    </>
  )
}

export default Page
