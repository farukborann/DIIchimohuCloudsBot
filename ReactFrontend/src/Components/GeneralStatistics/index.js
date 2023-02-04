import ApexChart from 'react-apexcharts'
import Api from '../../Others/Api'
import { useEffect, useState } from 'react'

const GetOptions = (title, labels) => {
  return {
    title: {
      text: title
    },
    chart: {
      type: 'donut'
    },
    labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
    // colors: ['#00b746', '#2861fd', '#a21c1e']
  }
}

const Chart = ({ SelectedPair, className, height, width }) => {
  const ResultedSettings = GetOptions('Sonuçlanmış / Sonuçlanmamış İşlemler', ['Sonuçlanmış', 'Sonuçlanmamış'])
  const ProfitLossSettings = GetOptions('Karlı / Zararlı İşlemler', ['Karlı', 'Zararlı'])
  const [ResultedData, SetResultedData] = useState([])
  const [ProfitLossData, SetProfitLossData] = useState([])
  const [ProfitSum, SetProfitSum] = useState('-')
  const [OrderCount, SetOrderCount] = useState('-')

  const Update = () => {
    if (!SelectedPair) return

    Api.GetGeneralStatistics({ Symbol: SelectedPair }).then((Statistics) => {
      SetResultedData([Statistics.ResultedOrderCount, Statistics.OrderCount - Statistics.ResultedOrderCount])
      SetProfitLossData([Statistics.ProfitedOrderCount, Statistics.LossedOrderCount])
      SetProfitSum(Statistics.RealizedProfitsSum)
      SetOrderCount(Statistics.OrderCount)
    })
  }

  useEffect(() => {
    Update()
  }, [SelectedPair])
  // className={className}
  return (
    <div className="float-left inline-flex p-5 border-2 border-gray-300 outline-none">
      <ApexChart options={ResultedSettings} series={ResultedData} type="donut" height={400} width={400} />
      <ApexChart options={ProfitLossSettings} series={ProfitLossData} type="donut" height={400} width={400} className={'ml-10'} />
      <div className="ml-10">
        <label>Toplam {ProfitSum} USDT Kar/Zarar</label>
        <br></br>
        <label>Toplam {OrderCount} İşlem</label>
      </div>
    </div>
  )
}

export default Chart
