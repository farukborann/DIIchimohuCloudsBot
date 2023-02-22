import Api from '../../Others/Api'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const OrderHistory = ({ SelectedPair, className }) => {
  const [Orders, SetOrders] = useState([])

  const Update = async () => {
    let _Orders = await Api.GetLast20Order({ Symbol: SelectedPair })
    SetOrders(_Orders.reverse())
  }

  useEffect(() => {
    Update()
  }, [SelectedPair])

  useEffect(() => {
    Update()
  }, [])

  return (
    <div className={'p-5 border-2 border-gray-300 w-[1100px] ' + className}>
      <table className="whitespace-nowrap w-full">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Side</th>
            <th>Size</th>
            <th>Stop Price</th>
            <th>Take Profit Price</th>
            <th>Realized Profit</th>
            <th>Close Date</th>
          </tr>
        </thead>
        <tbody>
          {Orders.map((Order) => {
            return (
              <>
                <tr>
                  <td className="text-center">{Order.Symbol}</td>
                  <td className="text-center">{Order.Side}</td>
                  <td className="text-center">{Order.Size}</td>
                  <td className="text-center">{Order.StopPrice}</td>
                  <td className="text-center">{Order.TakeProfitPrice}</td>
                  <td className="text-center">{Order.RealizedProfit}</td>
                  <td className="text-center">{format(new Date(Order.ClosedDate), 'HH:mm dd/MM/yyyy')}</td>
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
