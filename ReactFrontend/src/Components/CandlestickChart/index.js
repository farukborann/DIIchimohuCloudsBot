import ApexChart from 'react-apexcharts'
import Api from '../../Others/Api'
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

const Chart = ({ SelectedPair, SelectedInterval, Updater, SetUpdater, className, height, width }) => {
  const [Options, SetOptions] = useState(GetOptions(''))

  const [KlineSerie, SetKlineSerie] = useState([])
  const [ConversionLineSerie, SetConversionLineSerie] = useState([])
  const [BaseLineSerie, SetBaseLineSerie] = useState([])

  const Update = () => {
    if (!SelectedPair || !SelectedInterval) return

    Api.GetIchimoku(SelectedPair, SelectedInterval)
      .then((newKlines) => {
        let klinesData = []
        let conversionLineData = []
        let baseLineData = []

        // Has ichimoku
        newKlines.forEach((Kline) => {
          let openTime = new Date(new Date(Kline.openTime).toLocaleString('en-EN'))
          console.log(openTime)
          if (Kline.conversionValue || Kline.baseValue) {
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
          klinesData = newKlines.map((Kline) => {
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
      })
      .then(() => {
        SetOptions(GetOptions(SelectedPair + ' ' + SelectedInterval))
      })
  }

  useEffect(() => {
    Update()
  }, [SelectedPair, SelectedInterval])

  useEffect(() => {
    if (Updater !== true) return
    Update()
    SetUpdater(false)
  }, [Updater])

  return <ApexChart options={Options} series={[KlineSerie, ConversionLineSerie, BaseLineSerie]} className={className} height={height} width={width} />
}

export default Chart
