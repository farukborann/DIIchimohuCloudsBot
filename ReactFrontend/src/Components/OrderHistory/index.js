import Api from '../../Others/Api'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { utils as XLSX_utils, writeFile as XLSX_writeFile } from 'xlsx'

const OrderHistory = ({ SelectedPair, className }) => {
  const [Orders, SetOrders] = useState([])

  const Update = async () => {
    let _Orders = await Api.GetLastOrders({ Symbol: SelectedPair })
    SetOrders(_Orders.reverse())
  }

  useEffect(() => {
    Update()
  }, [SelectedPair])

  useEffect(() => {
    Update()
  }, [])

  return (
    <div className={'p-5 border-2 border-gray-300 w-[1107px] ' + className}>
      <button
        className="w-full border-2 border-gray-300"
        onClick={async () => {
          let WB = XLSX_utils.book_new()
          let Orders = await Api.GetAllOrders({ Symbol: SelectedPair })
          let OrdersWS = XLSX_utils.json_to_sheet(
            Orders.map((Order) => {
              let Data = {
                ...Order,
                OpenDate: format(new Date(Order.OpenDate), 'HH:mm dd/MM/yyyy'),
                CloseDate: format(new Date(Order.ClosedDate), 'HH:mm dd/MM/yyyy')
              }
              delete Data.ClosedDate
              return Data
            })
          )
          XLSX_utils.book_append_sheet(WB, OrdersWS, 'Orders')
          XLSX_writeFile(WB, SelectedPair + ' All Orders.xlsx')
        }}
      >
        Tüm Verileri İndir
      </button>
      <br></br>
      <br></br>
      <table className="whitespace-nowrap w-full border-2 border-gray-300">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Interval</th>
            <th>CLL/BLL</th>
            <th>Side</th>
            <th>Size</th>
            <th>Stop Price</th>
            <th>Take Profit Price</th>
            <th>Realized Profit</th>
            <th>Open Date</th>
            <th>Close Date</th>
          </tr>
        </thead>
        <tbody>
          {Orders.map((Order) => {
            return (
              <>
                <tr>
                  <td className="text-center">{Order.Symbol}</td>
                  <td className="text-center">{Order.Interval}</td>
                  <td className="text-center">{Order.IndicatorSettings}</td>
                  <td className="text-center">{Order.Side}</td>
                  <td className="text-center">{Order.Size}</td>
                  <td className="text-center">{Order.StopPrice}</td>
                  <td className="text-center">{Order.TakeProfitPrice}</td>
                  <td className="text-center">{Order.RealizedProfit}</td>
                  <td className="text-center">
                    {Order.ClosedDate ? format(new Date(Order.OpenDate), 'HH:mm dd/MM/yyyy') : ''}
                  </td>
                  <td className="text-center">
                    {Order.ClosedDate ? format(new Date(Order.ClosedDate), 'HH:mm dd/MM/yyyy') : ''}
                  </td>
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default OrderHistory
