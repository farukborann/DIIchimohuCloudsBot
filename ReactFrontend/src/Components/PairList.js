import Api from '../Others/Api'
import { useEffect, useState } from 'react'

const Chart = ({ SetSelectedPair, className }) => {
  const [Pairs, setPairs] = useState([])

  useEffect(() => {
    Api.GetExchangeInfo().then((exchangeInfo) => {
      setPairs(exchangeInfo.symbols)
    })
  }, [])

  return (
    <select
      name="Pairs"
      size="75"
      className={'p-2 ' + className}
      onChange={(e) => {
        SetSelectedPair(e.target.value)
      }}
    >
      {Pairs.map((pair) => {
        return (
          <option value={pair.symbol} key={pair.symbol}>
            {pair.symbol}
          </option>
        )
      })}
    </select>
  )
}

export default Chart
