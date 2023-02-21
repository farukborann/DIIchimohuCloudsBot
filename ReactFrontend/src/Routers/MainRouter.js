import { Navigate, useRoutes } from 'react-router-dom'
import MainPage from '../Pages/MainPage'
import Database from '../Pages/Database'
import Backtest from '../Pages/Backtest'

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <MainPage />
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
