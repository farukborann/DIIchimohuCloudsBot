import Api from '../../Others/Api'
import { useEffect, useState } from 'react'

const BotsList = ({ Updater, SetUpdater, SetSelectedPair, SetSelectedInterval, Bots, SetBots, className }) => {
  const Update = async () => {
    let _Bots = await Api.GetAllBots()
    SetBots(_Bots)
    console.log(Bots)
  }

  useEffect(() => {
    Update()
  }, [Updater])

  useEffect(() => {
    Update()
  }, [])

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className}>
      <table className="whitespace-nowrap w-full">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Interval</th>
            <th>CLL/BLL</th>
            <th>T2B Cross Price</th>
            <th>B2T Cross Price</th>
            <th>Stop</th>
            <th>Logs</th>
          </tr>
        </thead>
        <tbody>
          {Bots.map((Bot) => {
            return (
              <>
                <tr>
                  <td className="text-center">{Bot.Symbol}</td>
                  <td className="text-center">{Bot.Interval}</td>
                  <td className="text-center">
                    {Bot.ConversionLength}/{Bot.BaseLength}
                  </td>
                  <td className="text-center">{Bot.Cross1Order.Price}</td>
                  <td className="text-center">{Bot.Cross2Order.Price}</td>
                  <td className="text-center">
                    <button
                      className="border-2 border-gray-300 w-8"
                      onClick={async () => {
                        if (window.confirm('Are you sure ?')) {
                          let result = await Api.StopBot({ Symbol: Bot.Symbol })
                          if (result.error) alert(result.error)
                        }
                        SetUpdater(true)
                      }}
                    >
                      X
                    </button>
                  </td>
                  <td className="text-center">
                    <button
                      className="border-2 border-gray-300"
                      onClick={async () => {
                        SetSelectedPair(Bot.Symbol)
                        SetSelectedInterval(Bot.Interval)
                      }}
                    >
                      Show
                    </button>
                  </td>
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BotsList
