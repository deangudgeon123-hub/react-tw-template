import { config } from '@config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useEffectOnce } from 'react-use'

import { ErrorHandler } from '@/helpers'
import { createRouter } from '@/routes'

import { ThemeProvider } from './contexts/ThemeProvider'
import { Web3Provider } from './contexts/Web3Provider'

const router = createRouter()

const queryClient = new QueryClient()

const metadata = {
  title: 'react-tw-template',
  description: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
  url: 'https://example.com',
  image: 'https://example.org/branding/og-img.png',
  locale: 'en_GB',
  type: 'website',
  twitter: {
    card: 'summary_large_image',
    domain: 'example.org',
    url: 'https://example.org',
    title: 'react-tw-template',
    description: 'react-tw-template',
    image: 'https://example.org/branding/og-img.png',
  },
}

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
        <title>react-tw-template</title>
        <meta name='description' content={metadata.description} />
        <meta property='og:title' content={metadata.title} />
        <meta property='og:description' content={metadata.description} />
        <meta property='og:url' content={metadata.url} />
        <meta property='og:image' content={metadata.image} />
        <meta property='og:locale' content={metadata.locale} />
        <meta property='og:type' content={metadata.type} />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name='twitter:card' content={metadata.twitter.card} />
        <meta property='twitter:domain' content={metadata.twitter.domain} />
        <meta property='twitter:url' content={metadata.twitter.url} />
        <meta name='twitter:title' content={metadata.twitter.title} />
        <meta
          name='twitter:description'
          content={metadata.twitter.description}
        />
        <meta name='twitter:image' content={metadata.twitter.image} />

        <Web3Provider>
          <RouterProvider router={router} />
        </Web3Provider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
