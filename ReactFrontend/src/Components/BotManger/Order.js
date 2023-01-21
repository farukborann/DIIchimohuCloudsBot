import { useState } from 'react'

const Order = ({ Values, SetValues, className }) => {
  const [IsLimitOrder, SetIsLimitOrder] = useState(Values.IsLimitOrder)

  return (
    <div className={className}>
      <select
        defaultValue={IsLimitOrder ? 'Limit' : 'Market'}
        onChange={(e) => {
          if (e.target.value == 'Limit') SetIsLimitOrder(true)
          else SetIsLimitOrder(false)
          SetValues({ ...Values, IsLimitOrder })
        }}
      >
        <option>Limit</option>
        <option>Market</option>
      </select>
      {IsLimitOrder ? (
        <>
          <label className="ml-10">Price</label>
          <input
            defaultValue={Values.Price}
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Price: e.target.value })
            }}
          ></input>
          <label className="ml-10">Size</label>
          <input
            defaultValue={Values.Size}
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Size: e.target.value })
            }}
          ></input>
        </>
      ) : (
        <>
          <label className="ml-10">Size</label>
          <input
            defaultValue={Values.Size}
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Price: undefined, Size: e.target.value })
            }}
          ></input>
        </>
      )}
    </div>
  )
}

export default Order
