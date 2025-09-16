import { AppKitNetwork, defineChain } from '@reown/appkit/networks'
import { useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import {
  JsonRpcProvider,
  JsonRpcSigner,
  TransactionReceipt,
  TransactionRequest,
  TransactionResponse,
} from 'ethers'
import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useMemo,
} from 'react'
import { Account, Chain, Client } from 'viem'
import {
  Transport,
  useAccount,
  useClient,
  useSwitchChain,
  useWalletClient,
  WagmiProvider,
} from 'wagmi'

import { wagmiAdapter } from '@/config'
import { useWeb3Context } from '@/contexts/Web3Provider'

import { getSignerOrProvider } from './helpers/providers'

export type EthContext = {
  address: string
  chain: AppKitNetwork | undefined
  isConnected: boolean

  signerOrProvider: JsonRpcSigner | JsonRpcProvider | undefined
  client: Client<Transport, Chain, Account> | undefined

  supportedChains: AppKitNetwork[]

  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: (network: AppKitNetwork) => Promise<void> // TODO: promisify this
  getFallbackSignerOrProvider: (
    chainId: string,
  ) => JsonRpcSigner | JsonRpcProvider

  signAndSendTransaction: (
    txRequest: TransactionRequest,
    opts?: {
      onTxSent?: (tx: TransactionResponse) => Promise<void>
    },
  ) => Promise<TransactionReceipt>
}

const ethContext = createContext<EthContext>({
  address: '',
  chain: undefined,
  isConnected: false,

  signerOrProvider: undefined,
  client: undefined,

  supportedChains: [],

  connect: async () => {},
  disconnect: () => {},
  switchNetwork: async () => {},
  getFallbackSignerOrProvider: () => {
    throw new TypeError('Not implemented')
  },

  signAndSendTransaction: async () => {
    throw new TypeError('Not implemented')
  },
})

export const useEthContext = () => {
  return use(ethContext)
}

export const EthProvider = ({ children }: PropsWithChildren) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <EthProviderContent>{children}</EthProviderContent>
    </WagmiProvider>
  )
}

export const EthProviderContent = (props: PropsWithChildren) => {
  const { connectAsync } = useWeb3Context()

  const { chain } = useAccount()
  const { chains, switchChainAsync } = useSwitchChain()

  const { isConnected, address } = useAppKitAccount({
    namespace: 'eip155',
  })

  const { disconnect } = useDisconnect()

  const { data: walletClient } = useWalletClient({
    config: wagmiAdapter.wagmiConfig,
  })
  const client = useClient()

  const supportedChains = useMemo(() => {
    return chains.map(el =>
      defineChain({
        ...el,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${el.id}`,
      }),
    )
  }, [chains])

  const switchNetwork = async (chain: AppKitNetwork) => {
    await switchChainAsync({
      chainId: Number(chain.id),
    })
  }

  const signerOrProvider = useMemo(() => {
    return getSignerOrProvider(
      walletClient || (client as Client<Transport, Chain>),
    )
  }, [client, walletClient])

  const getFallbackSignerOrProvider = useCallback(
    (chainId: string) => {
      const appKitChain = supportedChains.find(el => el.id === Number(chainId))

      if (!appKitChain) {
        throw new Error(
          `Chain with id ${chainId} not found in supported chains`,
        )
      }

      if (String(appKitChain.id) === String(chain?.id) && isConnected) {
        return signerOrProvider
      }

      return new JsonRpcProvider(appKitChain.rpcUrls.default.http[0])
    },
    [chain?.id, isConnected, signerOrProvider, supportedChains],
  )

  const signAndSendTransaction = useCallback<
    EthContext['signAndSendTransaction']
  >(
    async (txRequest, opts) => {
      if (!signerOrProvider) throw new TypeError('Signer or provider not found')

      if (!(signerOrProvider instanceof JsonRpcSigner))
        throw new TypeError('Signer or provider is not a JsonRpcSigner')

      const tx = await signerOrProvider.sendTransaction({
        ...txRequest,
        ...(!txRequest.from && { from: address }),
      })

      await opts?.onTxSent?.(tx)

      const receipt = await tx.wait()

      if (!receipt) {
        throw new TypeError('Transaction receipt not found')
      }

      return receipt
    },
    [address, signerOrProvider],
  )

  return (
    <ethContext.Provider
      value={{
        address: address ?? '',
        chain: chain,
        isConnected: isConnected,

        signerOrProvider,
        client: walletClient,

        supportedChains,

        connect: async () => {
          await connectAsync('eip155')
        },
        disconnect: async () => {
          await disconnect({
            namespace: 'eip155',
          })
        },
        switchNetwork,
        getFallbackSignerOrProvider,

        signAndSendTransaction,
      }}
    >
      {props.children}
    </ethContext.Provider>
  )
}
