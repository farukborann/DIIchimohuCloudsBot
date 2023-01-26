import Api from '../Others/Api'
import { useEffect, useState } from 'react'

const Chart = ({ SelectedPair, SetSelectedPair, className }) => {
  const [Pairs, setPairs] = useState([])

  useEffect(() => {
    Api.GetExchangeInfo().then((exchangeInfo) => {
      setPairs(
        exchangeInfo.symbols.map((Pair) => {
          return { Symbol: Pair.symbol }
        })
      )
    })
  }, [])

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
      {Pairs.map((Pair) => {
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
