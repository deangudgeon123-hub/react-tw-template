import { config } from '@config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { ErrorHandler } from '@/helpers'
import { createRouter } from '@/routes'

import { ThemeProvider } from './contexts/ThemeProvider'

const router = createRouter()

const queryClient = new QueryClient()

export function App() {
  const [isAppInitialized, setIsAppInitialized] = useState(false)

  const init = useCallback(async () => {
    try {
      if (config.VITE_APP_NAME) {
        document.title = config.VITE_APP_NAME
      }
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }

    setIsAppInitialized(true)
  }, [])

  useEffectOnce(() => {
    init()
  })

  if (!isAppInitialized) return null

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        {/* <Web3Provider> */}
        <RouterProvider router={router} />
        {/* </Web3Provider> */}
      </QueryClientProvider>
    </ThemeProvider>
  )
}
