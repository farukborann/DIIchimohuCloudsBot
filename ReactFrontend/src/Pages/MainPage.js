import { useState, useEffect } from 'react'
import CandlestickChart from '../Components/CandlestickChart'
import UpdateChartButton from '../Components/CandlestickChart/UpdateChartButton'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'
import BotManger from '../Components/BotManger'
import BotsList from '../Components/BotsList'

const Page = () => {
  const [SelectedPair, SetSelectedPair] = useState('')
  const [SelectedInterval, SetSelectedInterval] = useState('')

  const [Updater, SetUpdater] = useState(false)
  const AutoUpdate = () => {
    SetUpdater(true)
    setTimeout(() => {
      AutoUpdate()
    }, (60 - new Date().getSeconds()) * 1000)
  }
  useEffect(() => {
    AutoUpdate()
  }, [])

  return (
    <>
      <div className="flex flex-nowrap float-left m-5">
        <PairList className="float-left border-2 border-gray-300 h-min outline-none" SetSelectedPair={SetSelectedPair} />
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
              <IntervalList className="border-2 border-gray-300 h-fit outline-none" SetSelectedInterval={SetSelectedInterval} />
              <br></br>
              <UpdateChartButton SetUpdater={SetUpdater} />
            </div>
            <BotsList Updater={Updater} SetUpdater={SetUpdater} className="float-left w-[810px] h-[515px]" />
          </div>
          <br></br>
          <BotManger className="float-left w-[810px] h-fit" SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} SetUpdater={SetUpdater} />
        </div>
      </div>
    </>
  )
}

export default Page
