import { AbstractProvider, AbstractSigner } from 'ethers'
import {
  type Account,
  type Chain,
  Client,
  erc20Abi,
  type Transport,
} from 'viem'

import {
  createContract,
  createContractInstance,
} from '@/contexts/Web3Provider/EthProvider/helpers/contracts'

import { ERC20MintableBurnable__factory } from './types'

export function createERC20MintableBurnableContract(
  address: string,
  provider: AbstractProvider | AbstractSigner,
) {
  const { contractInstance, contractInterface } = createContract(
    address,
    provider,
    ERC20MintableBurnable__factory,
  )

  return {
    contractInstance,
    contractInterface,

    loadDetails: async () => {
      const [decimals, name, symbol, totalSupply] = await Promise.all([
        contractInstance.decimals(),
        contractInstance.name(),
        contractInstance.symbol(),
        contractInstance.totalSupply(),
      ])

      return {
        decimals,
        name,
        symbol,
        totalSupply,
      }
    },
  }
}

export function createErc20ContractInstance<
  Acc extends Account | undefined = Account | undefined,
>(address: `0x${string}`, client: Client<Transport, Chain, Acc>) {
  return createContractInstance(address, erc20Abi, client)
}
