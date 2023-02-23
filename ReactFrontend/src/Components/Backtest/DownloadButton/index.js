import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx'

const DownloadButton = ({ Result, SelectedPair, SelectedInterval, className }) => {
  return (
    <button
      className="p-2 border-2 border-gray-300 outline-none"
      onClick={(e) => {
        if (Result) {
          let ProfitSum = Math.round(Result.Statistics.RealizedProfitsSum * 100000000) / 100000000
          let Size = Result.AllOrders.length ? Result.AllOrders[0].Size : 0

          let WB = XLSX_utils.book_new()
          let StatisticsWS = XLSX_utils.json_to_sheet([
            {
              Name: 'Sembol',
              Value: SelectedPair + ' ' + SelectedInterval
            },
            {
              Name: 'Toplam Kar/Zarar',
              Value: Math.round(ProfitSum * 100) / 100
            },
            {
              Name: 'Yüzde Kar/Zarar',
              Value: Math.round((ProfitSum / Size) * 100 * 100) / 100
            },
            { Name: 'İşlem Sayısı', Value: Result.Statistics.OrderCount },
            {
              Name: 'Başlangıç Tarihi',
              Value: format(new Date(Result.StartDate), 'HH:mm dd/MM/yyyy')
            },
            {
              Name: 'Bitiş Tarihi',
              Value: format(new Date(Result.EndDate), 'HH:mm dd/MM/yyyy')
            }
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

          XLSX_utils.book_append_sheet(WB, StatisticsWS, 'Statistics')
          XLSX_utils.book_append_sheet(WB, OrdersWS, 'Orders')
          XLSX_writeFile(WB, SelectedPair + '-' + SelectedInterval + ' ' + format(new Date(), 'dd-MM-yyyy') + '.xlsx')
        }
      }}
    >
      Sonuçları İndir
    </button>
  )
}

export default DownloadButton
