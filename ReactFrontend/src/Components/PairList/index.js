import { useState, useEffect } from 'react'
import Api from '../../Others/Api'

const Chart = ({ Updater, SetUpdater, SelectedPair, SetSelectedPair, ExchangeInfo, className }) => {
  const [Favorites, SetFavorites] = useState([])

  const Update = async () => {
    let _Favorites = await Api.GetFavorites()
    console.log(_Favorites)
    SetFavorites(_Favorites)
  }

  useEffect(() => {
    if (Updater !== true) return
    Update()
    SetUpdater(false)
  }, [Updater])

  return (
    <div className="float-left">
      <select
        name="Pairs"
        size="55"
        className={'p-2 ' + className}
        value={SelectedPair}
        onChange={(e) => {
          SetSelectedPair(e.target.value)
        }}
      >
        {Favorites.map((Favorite) => {
          if (
            !ExchangeInfo.filter((Pair) => {
              return Pair.symbol === Favorite
            }).length
          )
            return
          return (
            <option value={Favorite} key={Favorite}>
              {Favorite}
            </option>
          )
        })}
        {ExchangeInfo.map((Pair) => {
          if (
            Favorites.filter((Favorite) => {
              return Pair.symbol === Favorite
            }).length
          )
            return
          return (
            <option value={Pair.symbol} key={Pair.symbol}>
              {Pair.symbol}
            </option>
          )
        })}
      </select>
      <br></br>
      <button
        className="border-2 border-gray-300 p-2 m-auto w-full"
        onClick={async () => {
          if (Favorites.includes(SelectedPair)) {
            await Api.DelFavorite({ Symbol: SelectedPair })
          } else {
            await Api.AddFavorite({ Symbol: SelectedPair })
          }
          SetUpdater(true)
        }}
      >
        {Favorites.includes(SelectedPair) ? 'Favoriyi Kaldır' : 'Favorile'}
      </button>
    </div>
  )
}

export default Chart
