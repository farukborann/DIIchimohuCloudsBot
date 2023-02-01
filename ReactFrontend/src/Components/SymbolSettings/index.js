import Api from '../../Others/Api'
import { useEffect, useState } from 'react'

const SymbolSettings = ({ SelectedPair, Updater, SetUpdater, className }) => {
  const [Leverage, SetLeverage] = useState(1)
  const [MaxLeverage, SetMaxLeverage] = useState(1)
  const [MarginMode, SetMarginMode] = useState('')

  const Update = async () => {
    if (!SelectedPair) return

    let SymbolSettings = await Api.GetSymbolSettings({ Symbol: SelectedPair })
    SetLeverage(SymbolSettings.CurrentLeverage)
    SetMaxLeverage(SymbolSettings.MaxLeverage)
    SetMarginMode(SymbolSettings.MarginMode)
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
      <br></br>
      <a>Margin Mode</a>
      <select
        className="ml-4"
        value={MarginMode}
        onChange={(e) => {
          SetMarginMode(e.target.value)
        }}
      >
        <option>Cross</option>
        <option>Isolated</option>
      </select>
      <br></br>
      <a>Leverage</a>
      <input
        type="range"
        min="1"
        max={MaxLeverage}
        value={Leverage}
        className="ml-4"
        onChange={(e) => {
          SetLeverage(e.target.value)
        }}
      ></input>
      <label className="ml-4">{Leverage + ' '}</label>
      <br></br>
      <br></br>
      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={async () => {
          await Api.SetSymbolSettings({ Symbol: SelectedPair, Leverage, MarginMode })
          SetUpdater(true)
        }}
      >
        Kaydet
      </button>
    </div>
  )
}

export default SymbolSettings
