import { Navigate, useRoutes } from 'react-router-dom'
import MainPage from '../Pages/MainPage'
import Database from '../Pages/Database'

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
    { path: '*', element: <Navigate to="/" replace /> }
  ])
}

export default Router
