import Api from '../../../Others/Api'
import Order from './Order'
import React from 'react'

const BotManager = ({
  SelectedPair,
  SelectedInterval,
  T2BCross,
  B2TCross,
  StartDate,
  EndDate,
  IndicatorValues,
  SetResult,
  SetT2BCross,
  SetB2TCross,
  SetStartDate,
  SetEndDate,
  SetIndicatorValues,
  className
}) => {
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
      <Order
        className={'mt-2 border-2 border-slate-300 p-2'}
        Values={T2BCross}
        SetValues={SetT2BCross}
      />

      <br></br>

      <label>Aşağıdan Yukarı Kesişim (Kırmızı X Mavi)</label>
      <br></br>
      <Order
        className={'mt-2 border-2 border-slate-300 p-2'}
        Values={B2TCross}
        SetValues={SetB2TCross}
      />

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
          let Result = await Api.Backtest(data)
          if (Result.error) alert(Result.error)
          else {
            SetResult(Result)
          }
        }}
      >
        Başlat
      </button>
    </div>
  )
}

export default BotManager
