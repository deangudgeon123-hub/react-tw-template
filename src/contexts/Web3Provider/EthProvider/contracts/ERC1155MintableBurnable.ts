import { AbstractProvider, AbstractSigner } from 'ethers'

import { createContract } from '@/contexts/Web3Provider/EthProvider/helpers/contracts'

import { ERC1155MintableBurnable__factory } from './types'

export function createERC1155MintableBurnableContract(
  address: string,
  provider: AbstractProvider | AbstractSigner,
) {
  const { contractInstance, contractInterface } = createContract(
    address,
    provider,
    ERC1155MintableBurnable__factory,
  )

  return {
    contractInstance,
    contractInterface,

    loadDetails: async () => {
      const [name, symbol] = await Promise.all([
        contractInstance.name(),
        contractInstance.symbol(),
      ])

      return {
        name,
        symbol,
      }
    },
  }
}
