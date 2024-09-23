import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
} from 'react'
import {
  createConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
  WagmiProvider,
} from 'wagmi'
import { base, mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

type Web3ProviderContext = {
  address: string
  chainId: number
  isConnected: boolean

  connect: () => void
  disconnect: () => void
}

const web3ProviderContext = createContext<Web3ProviderContext>({
  address: '',
  chainId: 0,
  isConnected: false,

  connect: () => {},
  disconnect: () => {},
})

export const useWeb3Context = () => {
  return useContext(web3ProviderContext)
}

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

export const Web3ContextProvider = (props: PropsWithChildren) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ContextProviderContent>
          {props.children}
        </Web3ContextProviderContent>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const Web3ContextProviderContent = (props: PropsWithChildren) => {
  const connectManager = useConnect()

  const { address, chainId, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const connect = useCallback(async () => {
    connectManager.connect({ connector: connectManager.connectors[0] })
  }, [connectManager])

  return (
    <web3ProviderContext.Provider
      value={{
        address: address ?? '',
        chainId: chainId ?? -1,
        isConnected,

        connect,
        disconnect,
      }}
    >
      {props.children}
    </web3ProviderContext.Provider>
  )
}
