import React from 'react'
import { useNavigate } from 'react-router-dom'

const Page = () => {
  const Navigator = useNavigate()

  return (
    <>
      <div className="flex justify-center items-center my-0 mx-auto h-screen">
        <button
          className="border-2 m-2 border-gray-300 outline-none w-1/6 h-1/6"
          onClick={() => {
            Navigator('/bot')
          }}
        >
          Bot
        </button>
        <button
          className="border-2 m-2 border-gray-300 outline-none w-1/6 h-1/6"
          onClick={() => {
            Navigator('/database')
          }}
        >
          Database
        </button>
        <button
          className="border-2 m-2 border-gray-300 outline-none w-1/6 h-1/6"
          onClick={() => {
            Navigator('/backtest')
          }}
        >
          Backtest
        </button>
      </div>
    </>
  )
}

export default Page
