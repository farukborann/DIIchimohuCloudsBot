import Api from '../../Others/Api'
import Order from './Order'
import { useEffect, useState } from 'react'

const BotManager = ({ SelectedPair, SelectedInterval, className }) => {
  const [T2BCross, SetT2BCross] = useState({ IsLimitOrder: true, Price: 0, Size: 0 })
  const [B2TCross, SetB2TCross] = useState({ IsLimitOrder: true, Price: 0, Size: 0 })

  const Update = () => {
    if (!SelectedPair || !SelectedInterval) return
  }

  useEffect(() => {
    Update()
  }, [SelectedPair, SelectedInterval])

  useEffect(() => {
    console.log(T2BCross)
  }, [T2BCross])

  return (
    <div className={'p-7 border-2 border-gray-300 ' + className}>
      <a>Yukarıdan Aşağı Kesişim (Mavi X Kırmızı)</a>
      <br></br>
      <Order className={'mt-2'} Values={T2BCross} SetValues={SetT2BCross} />

      <br></br>

      <a>Aşağıdan Yukarı Kesişim (Kırmızı X Mavi)</a>
      <br></br>
      <Order className={'mt-2'} Values={B2TCross} SetValues={SetB2TCross} />

      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={() => {
          console.log('asd')
        }}
      >
        Başlat
      </button>
    </div>
  )
}

export default BotManager
