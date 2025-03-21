import { Navigate, useRoutes } from 'react-router-dom'
import Main from '../Pages/Main'
import Bot from '../Pages/Bot'
import Database from '../Pages/Database'
import Backtest from '../Pages/Backtest'

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <Main />
    },
    {
      path: '/bot',
      element: <Bot />
    },
    {
      path: '/database',
      element: <Database />
    },
    {
      path: '/backtest',
      element: <Backtest />
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ])
}

export default Router
