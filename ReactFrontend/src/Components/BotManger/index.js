import Api from '../../Others/Api'
import Order from './Order'
import { useEffect, useState } from 'react'

let LastSettingsDefault = false

const T2BCrossDefault = {
  OrderType: 'Limit',
  Price: -1,
  Size: 0,
  Side: 'Short',
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const B2TCrossDefault = {
  OrderType: 'Limit',
  Price: -1,
  Size: 0,
  Side: 'Long',
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const BotManager = ({ SelectedPair, SelectedInterval, SetUpdater, Bots, className }) => {
  const [IndicatorValues, SetIndicatorValues] = useState({ CLL: 9, BLL: 26 })
  const [T2BCross, SetT2BCross] = useState(T2BCrossDefault)
  const [B2TCross, SetB2TCross] = useState(B2TCrossDefault)

  const Update = () => {
    if (!SelectedPair || !SelectedInterval) return

    let Bot = Bots.find((Bot) => {
      return Bot.Symbol === SelectedPair
    })
    if (!Bot) {
      if (!LastSettingsDefault) {
        SetT2BCross(T2BCrossDefault)
        SetB2TCross(B2TCrossDefault)
        LastSettingsDefault = true
      }
      return
    }

    SetIndicatorValues({ CLL: Bot.ConversionLength, BLL: Bot.BaseLength })
    SetT2BCross(Bot.Cross1Order)
    SetB2TCross(Bot.Cross2Order)
    LastSettingsDefault = false
  }

  useEffect(() => {
    Update()
  }, [SelectedPair, SelectedInterval, Bots])

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className}>
      <a>İndikatör Ayarları</a>
      <br></br>
      <section className="border-2 border-gray-300 p-2">
        <label className="mt-2">Conversion Line (Blue) Length</label>
        <input
          defaultValue={IndicatorValues.CLL}
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetIndicatorValues({ ...IndicatorValues, CLL: e.target.value })
          }}
        ></input>
        <br></br>
        <label className="mt-2">Base Line (Red) Length</label>
        <input
          defaultValue={IndicatorValues.BLL}
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetIndicatorValues({ ...IndicatorValues, BLL: e.target.value })
          }}
        ></input>
      </section>

      <br></br>

      <a>Yukarıdan Aşağı Kesişim (Mavi X Kırmızı)</a>
      <br></br>
      <Order className={'mt-2 border-2 border-slate-300 p-2'} Values={T2BCross} SetValues={SetT2BCross} />

      <br></br>

      <a>Aşağıdan Yukarı Kesişim (Kırmızı X Mavi)</a>
      <br></br>
      <Order className={'mt-2 border-2 border-slate-300 p-2'} Values={B2TCross} SetValues={SetB2TCross} />

      <br></br>

      <a>Limit Order Price = -1 → Last Price</a>
      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={async () => {
          let data = { Symbol: SelectedPair, Interval: SelectedInterval, ConversionLength: IndicatorValues.CLL, BaseLength: IndicatorValues.BLL, Cross1Order: T2BCross, Cross2Order: B2TCross }
          let result = await Api.StartBot(data)
          if (result.error) alert(result.error)
          else {
            setTimeout(() => {
              SetUpdater(true)
            }, 2000)
          }
        }}
      >
        Başlat
      </button>
    </div>
  )
}

export default BotManager
