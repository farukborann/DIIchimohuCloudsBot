const Order = ({ Values, SetValues, className }) => {
  return (
    <div className={className}>
      <select // Limit Market Select
        defaultValue={Values.OrderType ? 'Limit' : 'Market'}
        onChange={(e) => {
          if (e.target.value === 'Limit') SetValues({ ...Values, OrderType: 'Limit' })
          else SetValues({ ...Values, OrderType: 'Market' })
        }}
      >
        <option>Limit</option>
        <option>Market</option>
      </select>
      <select // Long Short Select
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
      <input // Size Input
        type="number"
        defaultValue={Values.Size}
        className="ml-2 border-2 border-gray-300"
        onChange={(e) => {
          SetValues({ ...Values, Size: e.target.value })
        }}
      ></input>

      <br></br>

      <label className="ml-5">
        <input // Take Profit Checkbox
          defaultChecked={Values.TPOrder.IsActive}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            let _Values = { ...Values }
            _Values.TPOrder.IsActive = e.target.checked
            SetValues(_Values)
          }}
        ></input>
        Take Profit
      </label>
      {Values.TPOrder.IsActive ? (
        <>
          <label className="ml-4">
            <input
              type="number"
              className="ml-1 border-2 border-gray-300"
              defaultValue={Values.TPOrder.Price}
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.Price = e.target.value
                SetValues(_Values)
              }}
            ></input>
            <input
              type="checkbox"
              defaultChecked={Values.TPOrder.PercentMode}
              className="ml-2 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.PercentMode = e.target.checked
                SetValues(_Values)
              }}
            ></input>{' '}
            Percent Mode (%)
            <select
              defaultValue={Values.TPOrder.WorkingType === 'Last' ? 'Last' : 'Mark'}
              className="ml-2 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.WorkingType = e.target.value
                SetValues(_Values)
              }}
            >
              <option>Last</option>
              <option>Mark</option>
            </select>
          </label>
        </>
      ) : (
        <></>
      )}

      <br></br>

      <label className="ml-5">
        <input // Stop Loss Checkbox
          defaultChecked={Values.SLOrder.IsActive}
          type="checkbox"
          className="mr-1"
          onChange={(e) => {
            let _Values = { ...Values }
            _Values.SLOrder.IsActive = e.target.checked
            SetValues(_Values)
          }}
        ></input>
        Stop Loss{' '}
      </label>

      {Values.SLOrder.IsActive ? (
        <>
          <label className="ml-4">
            <input
              type="number"
              className="ml-1 border-2 border-gray-300"
              defaultValue={Values.SLOrder.Price}
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.Price = e.target.value
                SetValues(_Values)
              }}
            ></input>
            <input
              type="checkbox"
              defaultChecked={Values.SLOrder.PercentMode}
              className="ml-2 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.PercentMode = e.target.checked
                SetValues(_Values)
              }}
            ></input>{' '}
            Percent Mode (%)
            <select
              defaultValue={Values.SLOrder.WorkingType === 'Last' ? 'Last' : 'Mark'}
              className="ml-2 border-2 border-gray-300"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.WorkingType = e.target.value
                SetValues(_Values)
              }}
            >
              <option>Last</option>
              <option>Mark</option>
            </select>
          </label>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Order
