import ApexChart from 'react-apexcharts'
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
    ],
    colors: ['#00b746', '#a21c1e']
  }
}

const Chart = ({ Result }) => {
  const ProfitLossSettings = GetOptions('Karlı / Zararlı İşlemler', ['Karlı', 'Zararlı'])
  const [ProfitLossData, SetProfitLossData] = useState([])
  const [ProfitSum, SetProfitSum] = useState('-')
  const [OrderCount, SetOrderCount] = useState('-')
  const [Size, SetSize] = useState(0)

  const Update = () => {
    if (!Result) return

    SetProfitLossData([Result.Statistics.ProfitedOrderCount, Result.Statistics.LossedOrderCount])
    SetProfitSum(Math.round(Result.Statistics.RealizedProfitsSum * 100000000) / 100000000)
    SetOrderCount(Result.Statistics.OrderCount)
    SetSize(Result.AllOrders.length ? Result.AllOrders[0].Size : 0)
  }

  useEffect(() => {
    if (!Result) return

    Update()
  }, [Result])

  return (
    <div className="float-left inline-flex p-5 border-2 border-gray-300 outline-none">
      <ApexChart
        options={ProfitLossSettings}
        series={ProfitLossData}
        type="donut"
        height={400}
        width={720}
        className={'ml-10'}
      />
      <div className="ml-10">
        <label>Toplam {Math.round(ProfitSum * 100) / 100} USDT Kar/Zarar</label>
        <br></br>
        <br></br>
        <label>Toplam {OrderCount} İşlem</label>
        <br></br>
        <br></br>
        <label>Yüzde {Math.round((ProfitSum / Size) * 100 * 100) / 100} Kar/Zarar</label>
      </div>
    </div>
  )
}

export default Chart
