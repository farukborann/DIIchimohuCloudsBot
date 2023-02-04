const Intervals = ['1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']

const Chart = ({ SelectedInterval, SetSelectedInterval, className }) => {
  return (
    <select
      name="Intervals"
      size="15"
      className={'p-2 ' + className}
      value={SelectedInterval}
      onChange={(e) => {
        SetSelectedInterval(e.target.value)
      }}
    >
      {Intervals.map((interval) => {
        return (
          <option value={interval} key={interval}>
            {interval}
          </option>
        )
      })}
    </select>
  )
}

export default Chart
