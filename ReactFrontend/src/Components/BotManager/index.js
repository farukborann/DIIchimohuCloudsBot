import Api from '../../Others/Api'
import Order from './Order'
import { useEffect, useState } from 'react'

const RoundStepUp = (_Number, Precision) => {
  // Integers do not require rounding
  if (Number.isInteger(_Number)) return _Number
  const DecCount = Math.max(Precision.indexOf('1') - 1, 0)
  const Coefficient = Math.pow(10, DecCount)
  return Math.ceil(_Number * Coefficient) / Coefficient
}

const T2BCrossDefault = {
  OrderType: 'Limit',
  Price: -1,
  Size: 0,
  Side: 'Short',
  MinSize: 0,
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const B2TCrossDefault = {
  OrderType: 'Limit',
  Price: -1,
  Size: 0,
  Side: 'Long',
  MinSize: 0,
  TPOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' },
  SLOrder: { IsActive: true, Price: 2, PercentMode: true, WorkingType: 'Mark' }
}

const BotManager = ({
  SelectedPair,
  SelectedInterval,
  ExchangeInfo,
  SetUpdater,
  Bots,
  Leverage,
  className
}) => {
  const [IndicatorValues, SetIndicatorValues] = useState({ CLL: 9, BLL: 26 })
  const [T2BCross, SetT2BCross] = useState(T2BCrossDefault)
  const [B2TCross, SetB2TCross] = useState(B2TCrossDefault)
  const [SelectedPairExchangeInfo, SetSelectedPairExchangeInfo] = useState()

  let SetDefaultSettings = async () => {
    let SelectedPairExchangeInfo = ExchangeInfo.find((Pair) => Pair.symbol === SelectedPair)
    if (!SelectedPairExchangeInfo) {
      SetT2BCross(T2BCrossDefault)
      SetB2TCross(B2TCrossDefault)
      return
    }

    let LastPrice = (await Api.GetSymbolPrice({ Symbol: SelectedPair })).Price
    SetSelectedPairExchangeInfo(SelectedPairExchangeInfo)

    let LotSizeFilter = SelectedPairExchangeInfo.filters.find(
      (filter) => filter.filterType === 'LOT_SIZE'
    )
    let NationalFilter = SelectedPairExchangeInfo.filters.find(
      (filter) => filter.filterType === 'MIN_NOTIONAL'
    )
    let PriceFilter = SelectedPairExchangeInfo.filters.find(
      (filter) => filter.filterType === 'PRICE_FILTER'
    )

    let MinQty = LotSizeFilter.minQty
    let MinNational = NationalFilter.notional
    MinNational = RoundStepUp(MinNational / LastPrice, LotSizeFilter.stepSize) * LastPrice
    MinNational = RoundStepUp(MinNational, PriceFilter.tickSize)

    let MinSize = Math.max(MinQty * LastPrice, MinNational)
    MinSize = Math.round(MinSize * Math.pow(10, 8)) / Math.pow(10, 8)

    SetT2BCross({ ...T2BCrossDefault, MinSize: MinSize, Size: MinSize })
    SetB2TCross({ ...B2TCrossDefault, MinSize: MinSize, Size: MinSize })
  }

  const Update = () => {
    if (!SelectedPair || !SelectedInterval) return

    let Bot = Bots.find((Bot) => {
      return Bot.Symbol === SelectedPair
    })
    if (!Bot) {
      SetDefaultSettings()
      return
    }

    SetIndicatorValues({ CLL: Bot.ConversionLength, BLL: Bot.BaseLength })
    SetT2BCross(Bot.Cross1Order)
    SetB2TCross(Bot.Cross2Order)
  }

  useEffect(() => {
    Update()
  }, [SelectedPair, SelectedInterval, Bots])

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className}>
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
        Leverage={Leverage}
        SetValues={SetT2BCross}
        SelectedPairExchangeInfo={SelectedPairExchangeInfo}
      />

      <br></br>

      <label>Aşağıdan Yukarı Kesişim (Kırmızı X Mavi)</label>
      <br></br>
      <Order
        className={'mt-2 border-2 border-slate-300 p-2'}
        Values={B2TCross}
        Leverage={Leverage}
        SetValues={SetB2TCross}
        SelectedPairExchangeInfo={SelectedPairExchangeInfo}
      />

      <br></br>

      <label>
        Limit Order Price = -1 → Last Price
        <br></br>
        PM → Percent Mode
        <br></br>
        Size PM Only Available For USDT Pairs !! (Size = Balance * Size Percent * Leverage)
      </label>
      <button
        className="float-right border-2 border-gray-300 p-2"
        onClick={async () => {
          let data = {
            Symbol: SelectedPair,
            Interval: SelectedInterval,
            ConversionLength: IndicatorValues.CLL,
            BaseLength: IndicatorValues.BLL,
            Cross1Order: T2BCross,
            Cross2Order: B2TCross,
            Leverage
          }
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
