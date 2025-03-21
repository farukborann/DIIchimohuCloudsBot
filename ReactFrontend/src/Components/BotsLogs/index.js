import Api from '../../Others/Api'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

const BotsLogs = ({ Updater, onLoad, className }) => {
  const [Logs, SetLogs] = useState([])

  const Update = async () => {
    let Logs = await Api.GetLogs()
    SetLogs(Logs)
  }

  useEffect(() => {
    Update()
  }, [Updater])

  useEffect(() => {
    Update()
  }, [])

  return (
    <div className={'p-5 border-2 border-gray-300 ' + className} onLoad={onLoad}>
      <table className="whitespace-nowrap w-full">
        <caption>Logs</caption>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Date</th>
            <th>Cross</th>
          </tr>
        </thead>
        <tbody>
          {Logs.map((Log) => {
            return (
              <>
                <tr>
                  <td className="text-center">{Log.Symbol}</td>
                  <td className="text-center">{format(new Date(Log.Date), 'hh:mm:ss dd/MM/yyyy')}</td>
                  <td className="text-center">{Log.Cross === 1 ? 'Mavi X Kırmızı' : Log.Cross === 2 ? 'Kırımızı x Mavi' : Log.Cross}</td>
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default BotsLogs
