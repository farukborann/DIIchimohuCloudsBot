import { useState } from 'react'

const Order = ({ Values, SetValues, className }) => {
  const [IsLimitOrder, SetIsLimitOrder] = useState(Values.IsLimitOrder)
  const [TPOrder, SetTPOrder] = useState(Values.TPOrder)
  const [SLOrder, SetSLOrder] = useState(Values.SLOrder)

  return (
    <div className={className}>
      <select
        defaultValue={IsLimitOrder ? 'Limit' : 'Market'}
        onChange={(e) => {
          if (e.target.value === 'Limit') SetIsLimitOrder(true)
          else SetIsLimitOrder(false)
          SetValues({ ...Values, IsLimitOrder })
        }}
      >
        <option>Limit</option>
        <option>Market</option>
      </select>
      <select
        className="ml-4"
        defaultValue={Values.Side}
        onChange={(e) => {
          SetValues({ ...Values, Side: e.target.value })
        }}
      >
        <option>Long</option>
        <option>Short</option>
      </select>
      {IsLimitOrder ? (
        <>
          <label className="ml-4">Price</label>
          <input
            defaultValue={Values.Price}
            type="number"
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Price: e.target.value })
            }}
          ></input>
          <label className="ml-10">Size</label>
          <input
            type="number"
            defaultValue={Values.Size}
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Size: e.target.value })
            }}
          ></input>
        </>
      ) : (
        <>
          <label className="ml-4">Size</label>
          <input
            type="number"
            defaultValue={Values.Size}
            className="ml-2 border-2 border-gray-300"
            onChange={(e) => {
              SetValues({ ...Values, Price: undefined, Size: e.target.value })
            }}
          ></input>
        </>
      )}
      <br></br>
      <br></br>
      <label className="ml-5">
        <input
          defaultChecked={Values.TPOrder}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            SetTPOrder(e.target.checked)
          }}
        ></input>
        TP
      </label>
      <label className="ml-5">
        <input
          defaultChecked={Values.SLOrder}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            SetSLOrder(e.target.checked)
          }}
        ></input>
        SL
      </label>
      {TPOrder ? (
        <>
          <label className="ml-4">
            Take Profit
            <input
              type="number"
              defaultChecked={Values.SLOrder}
              className="ml-1 border-2 border-gray-300"
              onChange={(e) => {
                SetSLOrder(e.target.checked)
              }}
            ></input>
          </label>
        </>
      ) : (
        <></>
      )}
      {SLOrder ? (
        <>
          <label className="ml-4">
            Stop Loss
            <input
              type="number"
              defaultChecked={Values.SLOrder}
              className="ml-1 border-2 border-gray-300"
              onChange={(e) => {
                SetSLOrder(e.target.checked)
              }}
            ></input>
          </label>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Order
