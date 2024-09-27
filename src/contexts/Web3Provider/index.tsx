import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react'
import {
  type Account,
  type Chain,
  type Client,
  createPublicClient,
  createWalletClient,
  custom,
  type Transport,
} from 'viem'
import {
  createConfig,
  http,
  useAccount,
  useConnect,
  useDisconnect,
  WagmiProvider,
} from 'wagmi'
import { base, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const queryClient = new QueryClient()

export const config = createConfig({
  chains: [base, sepolia],
  connectors: [injected()],
  transports: {
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

const fallbackClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export type Web3ProviderContext<
  A extends Account | undefined = Account | undefined,
> = {
  client: Client<Transport, Chain, A>

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
    if (!account.chain) {
      return fallbackClient
    }

    return createWalletClient({
      account: account.address,
      chain: account.chain ?? fallbackClient.chain,
      transport: custom(window.ethereum), // FIXME
    })
  }, [account.address, account.chain])

  return (
    <web3ProviderContext.Provider
      value={{
        client: client!,

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
