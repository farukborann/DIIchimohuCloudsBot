import React from 'react'

const UpdateChartButton = ({ SetUpdater }) => {
  return (
    <button
      className="w-14 h-14 p-2"
      onClick={() => {
        SetUpdater(true)
      }}
    >
      <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          color="rgb(209 213 219)"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        ></path>
      </svg>
    </button>
  )
}
export default UpdateChartButton
