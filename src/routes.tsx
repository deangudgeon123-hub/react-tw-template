import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

// ✅ Define route paths
export enum RoutePaths {
  Root = '/',
  App = '/app',
  Dashboard = '/app/dashboard',
  Auth = '/auth',
}

// ✅ Lazy load your pages
const AppPage = lazy(() => import('@/pages/App'))
const Dashboard = lazy(() => import('@/pages/App/pages/Dashboard'))
const Auth = lazy(() => import('@/pages/Auth'))

// ✅ Create router with GitHub Pages basename + fallback route
export const createRouter = () =>
  createBrowserRouter(
    [
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
          {
            path: RoutePaths.Auth,
            element: <Auth />,
          },
          // ✅ Catch-all route for 404s
          {
            path: '*',
            element: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100vh',
                  flexDirection: 'column',
                }}
              >
                <h1>404 – Page Not Found</h1>
                <a href="/react-tw-template/" style={{ marginTop: 20, color: '#4f46e5' }}>
                  Go Home
                </a>
              </div>
            ),
          },
        ],
      },
    ],
    {
      basename: '/react-tw-template', // 👈 Required for GitHub Pages
    },
  )
