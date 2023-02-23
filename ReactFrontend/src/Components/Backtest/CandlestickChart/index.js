import ApexChart from 'react-apexcharts'
import { useEffect, useState } from 'react'

const GetOptions = (title) => {
  return {
    title: {
      text: title,
      align: 'left'
    },
    stroke: {
      width: [3, 1]
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false
      }
    },
    colors: ['#00b746', '#2861fd', '#a21c1e'],
    markers: {
      size: 1
    }
  }
}

const Chart = ({ SelectedPair, SelectedInterval, Result, className, height, width }) => {
  const [Options, SetOptions] = useState(GetOptions(''))
  const [KlineSerie, SetKlineSerie] = useState([])
  const [ConversionLineSerie, SetConversionLineSerie] = useState([])
  const [BaseLineSerie, SetBaseLineSerie] = useState([])

  const Update = () => {
    if (!SelectedPair || !SelectedInterval) return
    SetOptions(GetOptions(SelectedPair + ' ' + SelectedInterval))

    if (!Result) return
    let klinesData = []
    let conversionLineData = []
    let baseLineData = []

    let KlinesStartIndex = Result.Klines.length > 500 ? Result.Klines.length - 501 : 0
    let Klines = Result.Klines.slice(KlinesStartIndex, Result.Klines.length)

    // Has ichimoku
    Klines.forEach((Kline) => {
      if (Kline.conversionValue && Kline.baseValue) {
        let openTime = new Date(new Date(Kline.openTime).toLocaleString('en-EN'))

        conversionLineData.push({
          x: openTime,
          y: Kline.conversionValue
        })
        baseLineData.push({
          x: openTime,
          y: Kline.baseValue
        })
        klinesData.push({
          x: openTime,
          y: [Kline.open, Kline.high, Kline.low, Kline.close]
        })
      }
    })

    // No ichimoku
    if (!klinesData.length) {
      klinesData = Klines.map((Kline) => {
        return {
          x: new Date(Kline.openTime),
          y: [Kline.open, Kline.high, Kline.low, Kline.close]
        }
      })
    }

    let klineSerie = {
      name: SelectedPair + ' ' + SelectedInterval,
      type: 'candlestick',
      data: klinesData
    }

    let conversionSerie = {
      name: 'Conversion Line',
      type: 'line',
      data: conversionLineData
    }

    let baseSerie = {
      name: 'Base Line',
      type: 'line',
      data: baseLineData
    }

    SetKlineSerie(klineSerie)
    SetConversionLineSerie(conversionSerie)
    SetBaseLineSerie(baseSerie)
  }

  useEffect(() => {
    Update()
  }, [Result])

  return <ApexChart options={Options} series={[KlineSerie, ConversionLineSerie, BaseLineSerie]} className={className} height={height} width={width} />
}

export default Chart
