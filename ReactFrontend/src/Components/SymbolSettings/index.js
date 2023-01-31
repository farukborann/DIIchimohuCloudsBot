import Api from '../../Others/Api'
import { useEffect, useState } from 'react'

const SymbolSettings = ({ SelectedPair, Updater, SetUpdater, className }) => {
  const [Settings, SetSettings] = useState({})
  const [Leverage, SetLeverage] = useState({})

  const Update = () => {
    if (!SelectedPair) return

    let SymbolSettings = Api.GetSymbolSettings(SelectedPair)
    SetSettings(SymbolSettings)
  }

  useEffect(() => {
    Update()
  }, [SelectedPair])

  useEffect(() => {
    if (!Updater) return
    Update()
    SetUpdater(false)
  }, [Updater])

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className}>
      <a>Sembol Ayarları</a>
      <br></br>
      <select // Long Short Select
        className="ml-4"
        defaultValue={Settings.MarginType}
        value={Settings.MarginType}
        onChange={(e) => {
          SetSettings({ ...Settings, MarginType: e.target.value })
        }}
      >
        <option>Cross</option>
        <option>Isolated</option>
      </select>
      <input type="range" min="1" max={Settings.MaxLeverage} value={Settings.CurrentLeverage} className="ml-4" onChange={(e) => {
        SetLeverage(e.target.value)
      }}></input>
      <label className="ml-4">{}</label>
    </div>
  )
}

export default SymbolSettings
