import React from 'react'

const Chart = ({ SelectedPair, SetSelectedPair, ExchangeInfo, className }) => {
  return (
    <select
      name="Pairs"
      size="55"
      className={'p-2 ' + className}
      value={SelectedPair}
      onChange={(e) => {
        SetSelectedPair(e.target.value)
      }}
    >
      {ExchangeInfo.map((Pair) => {
        return (
          <option value={Pair.symbol} key={Pair.symbol}>
            {Pair.symbol}
          </option>
        )
      })}
    </select>
  )
}

export default Chart
