import Api from '../Others/Api'
import { useEffect, useState } from 'react'

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
          <option value={Pair.Symbol} key={Pair.Symbol}>
            {Pair.Symbol}
          </option>
        )
      })}
    </select>
  )
}

export default Chart
