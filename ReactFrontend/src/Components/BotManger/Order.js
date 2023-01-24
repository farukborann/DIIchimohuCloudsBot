const Order = ({ Values, SetValues, className }) => {
  return (
    <div className={className}>
      <select
        defaultValue={Values.OrderType ? 'Limit' : 'Market'}
        onChange={(e) => {
          if (e.target.value === 'Limit') SetValues({ ...Values, OrderType: 'Limit' })
          else SetValues({ ...Values, OrderType: 'Market' })
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
      {Values.OrderType === 'Limit' ? (
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
        </>
      ) : (
        <></>
      )}
      <label className="ml-10">Size</label>
      <input
        type="number"
        defaultValue={Values.Size}
        className="ml-2 border-2 border-gray-300"
        onChange={(e) => {
          SetValues({ ...Values, Size: e.target.value })
        }}
      ></input>
      <br></br>
      <br></br>
      <label className="ml-5">
        <input
          defaultChecked={Values.TPOrder.IsActive}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            let _Values = { ...Values }
            _Values.TPOrder.IsActive = e.target.checked
            SetValues(_Values)
          }}
        ></input>
        TP
      </label>
      <label className="ml-5">
        <input
          defaultChecked={Values.SLOrder.IsActive}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            let _Values = { ...Values }
            _Values.SLOrder.IsActive = e.target.checked
            SetValues(_Values)
          }}
        ></input>
        SL
      </label>
      {Values.TPOrder.IsActive ? (
        <>
          <label className="ml-4">
            Take Profit
            <input
              type="number"
              defaultChecked={Values.SLOrder}
              className="ml-1 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.Price = e.target.value
                SetValues(_Values)
              }}
            ></input>
          </label>
        </>
      ) : (
        <></>
      )}
      {Values.SLOrder.IsActive ? (
        <>
          <label className="ml-4">
            Stop Loss
            <input
              type="number"
              defaultChecked={Values.SLOrder}
              className="ml-1 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.Price = e.target.value
                SetValues(_Values)
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
