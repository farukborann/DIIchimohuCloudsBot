import ApexChart from 'react-apexcharts'
import Api from '../Others/Api'
import { useEffect, useState } from 'react'

const getOptions = (title) => {
  return {
    title: {
      text: title,
      align: 'left'
    },
    stroke: {
      width: [3, 1]
    },
    xaxis: {
      type: 'datetime'
    }
  }
}

const Chart = ({ SelectedPair, SelectedInterval, className, height, width }) => {
  const [Options, setOptions] = useState(getOptions(''))

  const [KlineSerie, SetKlineSerie] = useState([])
  const [ConversionLineSerie, SetConversionLineSerie] = useState([])
  const [BaseLineSerie, SetBaseLineSerie] = useState([])
  
  useEffect(() => {
    if (!SelectedPair || !SelectedInterval) return

    Api.GetIchimoku(SelectedPair, SelectedInterval)
      .then((newKlines) => {
        console.log(newKlines)
        let data = newKlines.map(({ Kline }) => {
          return {
            x: new Date(Kline.openTime),
            y: [Kline.open, Kline.high, Kline.low, Kline.close]
          }
        })

        let serie = {
          name: SelectedPair + ' ' + SelectedInterval,
          type: 'candlestick',
          data
        }

        SetKlineSerie(serie)
      })
      .then(() => {
        setOptions(getOptions(SelectedPair + ' ' + SelectedInterval))
      })
  }, [SelectedPair, SelectedInterval])

  return <ApexChart options={Options} series={[KlineSerie]} className={className} height={height} width={width} />
}

export default Chart
