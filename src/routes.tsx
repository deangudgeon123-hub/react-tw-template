import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { RoutePaths } from '@/enums'
import { MainLayout } from '@/layouts'

export const createRouter = () => {
  const Homepage = lazy(() => import('@/pages/Homepage'))

  const pageAnimationOpts = {
    initial: 'hide',
    animate: 'show',
    exit: 'hide',
    variants: {
      hide: {
        opacity: 0,
      },
      show: {
        opacity: 1,
      },
    },
    transition: { duration: 0.5 },
  }

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
          element: <MainLayout />,
          children: [
            {
              path: RoutePaths.Root,
              element: <Homepage {...pageAnimationOpts} />,
            },
            {
              path: '*',
              element: <Navigate replace to={RoutePaths.Root} />,
            },
          ],
        },
      ],
    },
  ])
}
