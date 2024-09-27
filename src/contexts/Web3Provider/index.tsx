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
  type Transport,
} from 'viem'
import {
  Connector,
  createConfig,
  http,
  useAccount,
  useClient,
  useConnect,
  useConnectorClient,
  UseConnectReturnType,
  useDisconnect,
  WagmiProvider,
} from 'wagmi'
import { base, sepolia } from 'wagmi/chains'
// import { walletConnect } from 'wagmi/connectors'

const queryClient = new QueryClient()

const fallbackClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export const config = createConfig({
  chains: [base, sepolia],
  // connectors: [
  //   walletConnect({
  //     projectId: '',
  //   }),
  // ],
  transports: {
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

export type Web3ProviderContext<
  A extends Account | undefined = Account | undefined,
> = {
  connectManager: UseConnectReturnType

  client: Client<Transport, Chain, A>

  address: `0x${string}` | ''
  chain: Chain
  isConnected: boolean

  connect: (connector: Connector) => void
  disconnect: () => void
}

const web3ProviderContext = createContext<Web3ProviderContext>({
  connectManager: {} as UseConnectReturnType,
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

  const connect = useCallback(
    async (connector: Connector) => {
      connectManager.connect({ connector })
    },
    [connectManager],
  )

  const publicClient = useClient({ config })

  const { data: walletClient } = useConnectorClient({ config })

  const client = useMemo(() => {
    if (!account.chain) {
      return publicClient as Client<Transport, Chain>
    }

    return walletClient as Client<Transport, Chain, Account>
  }, [account.chain, publicClient, walletClient])

  return (
    <web3ProviderContext.Provider
      value={{
        connectManager,

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
