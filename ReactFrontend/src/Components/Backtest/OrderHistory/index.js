import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const OrderHistory = ({ Result, className }) => {
  const [Orders, SetOrders] = useState([])

  const Update = async () => {
    SetOrders(Result.AllOrders.reverse())
  }

  useEffect(() => {
    if (!Result) return

    Update()
  }, [Result])

  return (
    <div className={'p-5 border-2 border-gray-300 w-[1100px] ' + className}>
      <table className="whitespace-nowrap w-full">
        <thead>
          <tr>
            <th>Side</th>
            <th>Size</th>
            <th>Open Price</th>
            <th>Close Price</th>
            <th>Close Type</th>
            <th>Open Date</th>
            <th>Close Date</th>
            <th>Profit</th>
            <th>Stop Price</th>
            <th>Take Profit Price</th>
          </tr>
        </thead>
        <tbody>
          {Orders.map((Order) => {
            return (
              <>
                <tr>
                  <td className="text-center">{Order.Side}</td>
                  <td className="text-center">{Order.Size}</td>
                  <td className="text-center">{Order.Price}</td>
                  <td className="text-center">{Order.ClosePrice}</td>
                  <td className="text-center">{Order.CloseType}</td>
                  <td className="text-center">{format(new Date(Order.OpenDate), 'HH:mm dd/MM/yyyy')}</td>
                  <td className="text-center">{format(new Date(Order.CloseDate), 'HH:mm dd/MM/yyyy')}</td>
                  <td className="text-center">{Math.round(Order.Profit * 100000000) / 100000000}</td>
                  <td className="text-center">{Math.round(Order.SLOrder.Price * 100000000) / 100000000}</td>
                  <td className="text-center">{Math.round(Order.TPOrder.Price * 100000000) / 100000000}</td>
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
