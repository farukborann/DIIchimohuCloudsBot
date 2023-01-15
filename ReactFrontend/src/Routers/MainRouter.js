import { Navigate, useRoutes } from 'react-router-dom'
import MainPage from '../Pages/MainPage'

const Router = () => {
  return useRoutes([
    {
      path: '/',
      element: <MainPage />
    },
    { path: '*', element: <Navigate to="/" replace /> }
  ])
}

export default Router
