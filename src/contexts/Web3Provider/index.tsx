import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import {
  Chain,
  Client,
  createPublicClient,
  createWalletClient,
  custom,
} from 'viem'
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

const queryClient = new QueryClient()

export const config = createConfig({
  chains: [mainnet, base, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

const fallbackClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export type Web3ProviderContext = {
  client: Client

  address: `0x${string}` | ''
  chain: Chain
  isConnected: boolean

  connect: () => void
  disconnect: () => void
}

const web3ProviderContext = createContext<Web3ProviderContext>({
  client: fallbackClient,

  address: '',
  chain: fallbackClient.chain,
  isConnected: false,

  connect: () => {},
  disconnect: () => {},
})

export const useWeb3Context = () => {
  return useContext(web3ProviderContext)
}

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

  const account = useAccount()
  const { disconnect } = useDisconnect()

  const connect = useCallback(async () => {
    connectManager.connect({ connector: connectManager.connectors[0] })
  }, [connectManager])

  const client = useMemo(() => {
    if (!account.address) {
      return fallbackClient
    }

    return createWalletClient({
      account: account.address,
      chain: sepolia,
      transport: custom(window?.ethereum),
    })
  }, [account.address])

  return (
    <web3ProviderContext.Provider
      value={{
        client: client,

        address: account.address ?? '',
        chain: account.chain ?? fallbackClient.chain,
        isConnected: account.isConnected,

        connect,
        disconnect,
      }}
    >
      {props.children}
    </web3ProviderContext.Provider>
  )
}
