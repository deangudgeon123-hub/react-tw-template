import { defineChain } from '@reown/appkit/networks'
import { useAppKit, useAppKitEvents, useDisconnect } from '@reown/appkit/react'
import { AppKitNetwork, ChainNamespace } from '@reown/appkit-common'
import { ChainController } from '@reown/appkit-controllers'
import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { EthProvider } from './EthProvider'

type Web3Context = {
  isInitialized: boolean
  allSupportedChains: AppKitNetwork[]
  connectAsync: (namespace: ChainNamespace) => Promise<void>
}

const web3Context = createContext<Web3Context>({
  isInitialized: false,
  allSupportedChains: [],

  connectAsync: async () => {
    throw new TypeError('Not implemented')
  },
})

export const useWeb3Context = () => {
  const context = use(web3Context)

  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider')
  }

  return context
}

const useConnectAsync = () => {
  const { open, close } = useAppKit()

  const { disconnect } = useDisconnect()

  const appKitEvent = useAppKitEvents()

  const [isConnecting, setIsConnecting] = useState(false)

  const connectPromiseResolve = useRef<() => void>(undefined)
  const connectPromiseReject = useRef<(error?: Error) => void>(undefined)

  useEffect(() => {
    if (!isConnecting) return

    if (appKitEvent?.data.event === 'CONNECT_SUCCESS') {
      connectPromiseResolve.current?.()
      connectPromiseResolve.current = () => () => {}
      connectPromiseReject.current = () => () => {}
      close()
      setIsConnecting(false)

      return
    }

    if (appKitEvent?.data.event === 'CONNECT_ERROR') {
      console.error('Failed to connect to AppKit:')
      connectPromiseResolve.current?.()
      connectPromiseResolve.current = () => () => {}
      connectPromiseReject.current = () => () => {}
      close()
      setIsConnecting(false)

      return
    }

    if (appKitEvent?.data.event === 'MODAL_CLOSE') {
      connectPromiseReject.current?.(new Error('User closed the modal'))
      connectPromiseResolve.current = () => () => {}
      connectPromiseReject.current = () => () => {}
      setIsConnecting(false)

      return
    }
  }, [
    appKitEvent?.data.event,
    close,
    connectPromiseReject,
    connectPromiseResolve,
    isConnecting,
  ])

  return async (namespace: ChainNamespace) => {
    await disconnect({
      namespace: namespace,
    })

    setIsConnecting(true)

    return new Promise<void>((resolve, reject) => {
      open({ view: 'Connect', namespace: namespace })

      connectPromiseResolve.current = resolve
      connectPromiseReject.current = reject
    })
  }
}

export const Web3Provider = ({ children }: PropsWithChildren) => {
  const [isInitialized, setIsInitialized] = useState(false)

  const appKitEvent = useAppKitEvents()

  const connectAsync = useConnectAsync()

  const allSupportedChains = useMemo(() => {
    return ChainController.getAllRequestedCaipNetworks().map(chain =>
      defineChain({
        ...chain,
        name: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpcUrls,
        id: chain.id,
        chainNamespace: chain.chainNamespace,
        caipNetworkId: chain.caipNetworkId,
        assets: chain.assets,
        blockExplorers: chain.blockExplorers,
      }),
    )
  }, [])

  useEffect(() => {
    if (
      appKitEvent?.data.event === 'CONNECT_SUCCESS' ||
      appKitEvent?.data.event === 'INITIALIZE'
    ) {
      setIsInitialized(true)
    }
  }, [appKitEvent])

  if (!isInitialized) return null

  return (
    <web3Context.Provider
      value={{
        isInitialized,
        allSupportedChains,

        connectAsync,
      }}
    >
      <EthProvider>{children}</EthProvider>
    </web3Context.Provider>
  )
}
