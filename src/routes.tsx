import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

export enum RoutePaths {
  Root = '/',

  App = '/app',
  Dashboard = '/app/dashboard',
}

export const createRouter = () => {
  const AppPage = lazy(() => import('@/pages/App'))
  const Dashboard = lazy(() => import('@/pages/App/pages/Dashboard'))

  return createBrowserRouter([
    {
      path: RoutePaths.Root,
      element: (
        <Suspense fallback={<></>}>
          <Outlet />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: <Navigate replace to={RoutePaths.App} />,
        },
        {
          path: RoutePaths.App,
          element: <AppPage />,
          children: [
            {
              index: true,
              element: <Navigate replace to={RoutePaths.Dashboard} />,
            },
            {
              path: RoutePaths.Dashboard,
              element: <Dashboard />,
            },
          ],
        },
      ],
    },
  ])
}
