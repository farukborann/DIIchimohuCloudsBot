import React from 'react'
import Api from '../../../Others/Api'
import { format } from 'date-fns'
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx'

const GeneralTests = ({
  SelectedPair,
  T2BCross,
  B2TCross,
  StartDate,
  EndDate,
  IndicatorValues,
  SetResult,
  SetSelectedInterval
}) => {
  return (
    <button
      className="p-2 border-2 border-gray-300 outline-none"
      onClick={async (e) => {
        let Intervals = ['3m', '5m', '15m', '30m', '1h', '2h', '4m']

        let WB = XLSX_utils.book_new()
        let GeneralStatistics = []
        let Workbooks = []
        for (let i = 0; i < Intervals.length; i++) {
          let Interval = Intervals[i]
          SetSelectedInterval(Interval)

          let Data = {
            Symbol: SelectedPair,
            Interval,
            StartDate,
            EndDate,
            ConversionLength: IndicatorValues.CLL,
            BaseLength: IndicatorValues.BLL,
            Cross1Order: T2BCross,
            Cross2Order: B2TCross
          }
          let Result = await Api.Backtest(Data)

          if (Result) {
            SetResult(Result)
            let ProfitSum = Math.round(Result.Statistics.RealizedProfitsSum * 100000000) / 100000000
            let Size = Result.AllOrders.length ? Result.AllOrders[0].Size : 0

            GeneralStatistics.push({
              Interval,
              'Toplam Kar/Zarar': Math.round(ProfitSum * 100) / 100,
              'Yüzde Kar/Zarar': Math.round((ProfitSum / Size) * 100 * 100) / 100,
              'Başlangıç Tarihi': format(new Date(StartDate), 'HH:mm dd/MM/yyyy'),
              'Bitiş Tarihi': format(new Date(EndDate), 'HH:mm dd/MM/yyyy')
            })

            let StatisticsWS = XLSX_utils.json_to_sheet([
              {
                Name: 'Sembol',
                Value: SelectedPair + ' ' + Interval
              },
              {
                Name: 'Toplam Kar/Zarar',
                Value: Math.round(ProfitSum * 100) / 100
              },
              {
                Name: 'Yüzde Kar/Zarar',
                Value: Math.round((ProfitSum / Size) * 100 * 100) / 100
              },
              { Name: 'İşlem Sayısı', Value: Result.Statistics.OrderCount }
            ])

            let OrdersWS = XLSX_utils.json_to_sheet(
              Result.AllOrders.map((Order) => {
                return {
                  Side: Order.Side,
                  Size: Order.Size,
                  OpenPrice: Order.Price,
                  ClosePrice: Order.ClosePrice,
                  CloseType: Order.CloseType,
                  OpenDate: format(new Date(Order.OpenDate), 'HH:mm dd/MM/yyyy'),
                  CloseDate: format(new Date(Order.CloseDate), 'HH:mm dd/MM/yyyy'),
                  Profit: Math.round(Order.Profit * 100000000) / 100000000,
                  StopPrice: Math.round(Order.SLOrder.Price * 100000000) / 100000000,
                  TakeProfitPrice: Math.round(Order.TPOrder.Price * 100000000) / 100000000
                }
              })
            )

            Workbooks.push(
              { Name: Interval + ' Statistics', Book: StatisticsWS },
              { Name: Interval + ' Orders', Book: OrdersWS }
            )
          }
        }

        let GeneralStatisticsWS = XLSX_utils.json_to_sheet(GeneralStatistics)
        XLSX_utils.book_append_sheet(WB, GeneralStatisticsWS, 'General Statistics')

        Workbooks.forEach((Workbook) => {
          XLSX_utils.book_append_sheet(WB, Workbook.Book, Workbook.Name)
        })

        XLSX_writeFile(WB, SelectedPair + format(new Date(), ' dd-MM-yyyy') + '.xlsx')
      }}
    >
      Genel Test Yap
    </button>
  )
}

export default GeneralTests
