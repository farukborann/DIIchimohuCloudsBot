import Api from '../../../Others/Api'
import Order from './Order'
import { useState } from 'react'

const T2BCrossDefault = {
  OrderType: 'Limit',
  Size: 100,
  Side: 'Short',
  MinSize: 0,
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const B2TCrossDefault = {
  OrderType: 'Limit',
  Size: 100,
  Side: 'Long',
  MinSize: 0,
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const BotManager = ({ SelectedPair, SelectedInterval, SetResult, className }) => {
  const [IndicatorValues, SetIndicatorValues] = useState({ CLL: 9, BLL: 26 })
  const [T2BCross, SetT2BCross] = useState(T2BCrossDefault)
  const [StartDate, SetStartDate] = useState()
  const [EndDate, SetEndDate] = useState()
  const [B2TCross, SetB2TCross] = useState(B2TCrossDefault)

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className}>
      <label>Tarihler</label>
      <br></br>
      <section className="border-2 border-gray-300 p-2">
        <label className="mt-2">Başlangıç Tarihi</label>
        <input
          type="datetime-local"
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetStartDate(e.target.value)
          }}
        ></input>
        <br></br>
        <label className="mt-2">Bitiş Tarihi</label>
        <input
          type="datetime-local"
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetEndDate(e.target.value)
          }}
        ></input>
      </section>

      <br></br>

      <label>İndikatör Ayarları</label>
      <br></br>
      <section className="border-2 border-gray-300 p-2">
        <label className="mt-2">Conversion Line (Blue) Length</label>
        <input
          value={IndicatorValues.CLL}
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetIndicatorValues({ ...IndicatorValues, CLL: e.target.value })
          }}
        ></input>
        <br></br>
        <label className="mt-2">Base Line (Red) Length</label>
        <input
          value={IndicatorValues.BLL}
          className="mt-2 ml-2 border-2 border-gray-300"
          onChange={(e) => {
            SetIndicatorValues({ ...IndicatorValues, BLL: e.target.value })
          }}
        ></input>
      </section>

      <br></br>

      <label>Yukarıdan Aşağı Kesişim (Mavi X Kırmızı)</label>
      <br></br>
      <Order className={'mt-2 border-2 border-slate-300 p-2'} Values={T2BCross} SetValues={SetT2BCross} />

      <br></br>

      <label>Aşağıdan Yukarı Kesişim (Kırmızı X Mavi)</label>
      <br></br>
      <Order className={'mt-2 border-2 border-slate-300 p-2'} Values={B2TCross} SetValues={SetB2TCross} />

      <br></br>

      <label>Limit Order Price = -1 → Last Price</label>
      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={async () => {
          let data = {
            Symbol: SelectedPair,
            Interval: SelectedInterval,
            StartDate,
            EndDate,
            ConversionLength: IndicatorValues.CLL,
            BaseLength: IndicatorValues.BLL,
            Cross1Order: T2BCross,
            Cross2Order: B2TCross
          }
          let result = await Api.Backtest(data)
          if (result.error) alert(result.error)
          else {
            SetResult({ ...result, StartDate, EndDate })
          }
        }}
      >
        Başlat
      </button>
    </div>
  )
}

export default BotManager
