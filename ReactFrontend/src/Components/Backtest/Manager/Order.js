import React from 'react'

const Order = ({ Values, SetValues, className }) => {
  return (
    <div className={className}>
      <select // Long Short Select
        className="ml-4"
        value={Values.Side}
        onChange={(e) => {
          SetValues({ ...Values, Side: e.target.value })
        }}
      >
        <option>Long</option>
        <option>Short</option>
      </select>
      <label className="ml-10">Size</label>
      <input // Size Input
        type="number"
        value={Values.Size}
        min={Values.MinSize}
        className="ml-2 border-2 border-gray-300"
        onChange={(e) => {
          SetValues({ ...Values, Size: e.target.value })
        }}
      ></input>
      <input
        type="checkbox"
        checked={Values.SizePercentMode}
        className="ml-2 border-2 border-gray-300"
        onChange={(e) => {
          let _Values = { ...Values }
          _Values.SizePercentMode = e.target.checked
          SetValues(_Values)
        }}
      ></input>{' '}
      PM (%)
      <br></br>
      <label className="ml-5 mt-5">
        <input // Take Profit Checkbox
          checked={Values.TPOrder.IsActive}
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
          <label className="ml-4 mt-5">
            <input
              type="number"
              className="ml-1 border-2 border-gray-300"
              value={Values.TPOrder.Price}
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.Price = e.target.value
                SetValues(_Values)
              }}
            ></input>
            <input
              type="checkbox"
              checked={Values.TPOrder.PercentMode}
              className="ml-2 border-2 border-gray-300 mt-5"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.TPOrder.PercentMode = e.target.checked
                SetValues(_Values)
              }}
            ></input>{' '}
            Percent Mode (%)
          </label>
        </>
      ) : (
        <></>
      )}
      <br></br>
      <label className="ml-5 mt-2">
        <input // Stop Loss Checkbox
          checked={Values.SLOrder.IsActive}
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
          <label className="ml-4 mt-2">
            <input
              type="number"
              className="ml-1 border-2 border-gray-300"
              value={Values.SLOrder.Price}
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.Price = e.target.value
                SetValues(_Values)
              }}
            ></input>
            <input
              type="checkbox"
              checked={Values.SLOrder.PercentMode}
              className="ml-2 border-2 border-gray-300 mt-2"
              onChange={(e) => {
                let _Values = { ...Values }
                _Values.SLOrder.PercentMode = e.target.checked
                SetValues(_Values)
              }}
            ></input>{' '}
            Percent Mode (%)
          </label>
        </>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Order
