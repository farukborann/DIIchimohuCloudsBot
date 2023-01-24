import Api from '../../Others/Api'
import Order from './Order'
import { useEffect, useState } from 'react'

const BotsList = ({ Updater, SetUpdater, className }) => {
  const Update = () => {}

  useEffect(() => {
    Update()
  }, [Updater])

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

      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={async () => {
          let data = { symbol: SelectedPair, interval: SelectedInterval, conversionLength: IndicatorValues.CLL, baseLength: IndicatorValues.BLL, cross1order: T2BCross, cross2order: B2TCross }
          let result = await Api.StartBot(data)
          if (result.error) alert(result.error)
          else {
            setTimeout(() => {
              SetChartUpdater(true)
            }, 2000)
          }
        }}
      >
        Başlat
      </button>
    </div>
  )
}

export default BotsList
