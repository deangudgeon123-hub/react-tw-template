import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

export enum RoutePaths {
  Root = '/',
}

export const createRouter = () => {
  const Homepage = lazy(() => import('@/pages/Homepage'))

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
          path: RoutePaths.Root,
          element: <Homepage />,
        },
        {
          path: '*',
          element: <Navigate replace to={RoutePaths.Root} />,
        },
      ],
    },
  ])
}
