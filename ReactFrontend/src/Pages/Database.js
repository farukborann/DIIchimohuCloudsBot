import Api from '../Others/Api'
import React, { useState, useEffect } from 'react'
import PairList from '../Components/PairList'
import GeneralStatistics from '../Components/GeneralStatistics'
import OrderHistory from '../Components/OrderHistory'

const Page = () => {
  const [ExchangeInfo, SetExchangeInfo] = useState([])
  const [SelectedPair, SetSelectedPair] = useState('BTCUSDT')

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
            <GeneralStatistics SelectedPair={SelectedPair} height={400} width={400} />
          </div>
          <br></br>
          <div className="float-left h-auto">
            <OrderHistory SelectedPair={SelectedPair} />
          </div>
          <br></br>
        </div>
      </div>
    </>
  )
}

export default Page
