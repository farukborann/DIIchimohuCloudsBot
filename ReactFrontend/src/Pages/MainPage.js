import { useState } from 'react'
import CandlestickChart from '../Components/CandlestickChart'
import PairList from '../Components/PairList'
import IntervalList from '../Components/IntervalList'

const Page = () => {
  const [SelectedPair, SetSelectedPair] = useState('')
  const [SelectedInterval, SetSelectedInterval] = useState('')

  return (
    <>
      <PairList className="float-left border-2 border-gray-300 w-30 h-screen mt-5 ml-5 outline-none" SetSelectedPair={SetSelectedPair} />
      <CandlestickChart className="float-left mt-5 border-2 border-gray-300" height={500} width={750} SelectedPair={SelectedPair} SelectedInterval={SelectedInterval} />
      <div className="float-left">
        <IntervalList className="border-2 border-gray-300 w-30 h-fit mt-5 outline-none" SetSelectedInterval={SetSelectedInterval} />
        <br></br>
        <button className="w-12 h-12 p-2 m-auto">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              color="rgb(209 213 219)"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            ></path>
          </svg>
        </button>
      </div>
    </>
  )
}

export default Page
