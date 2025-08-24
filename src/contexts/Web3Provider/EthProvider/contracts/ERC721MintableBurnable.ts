import { AbstractProvider, AbstractSigner } from 'ethers'

import { createContract } from '@/contexts/Web3Provider/EthProvider/helpers/contracts'

import { ERC721MintableBurnable__factory } from './types'

export function createERC721MintableBurnableContract(
  address: string,
  provider: AbstractProvider | AbstractSigner,
) {
  const { contractInstance, contractInterface } = createContract(
    address,
    provider,
    ERC721MintableBurnable__factory,
  )

  return {
    contractInstance,
    contractInterface,

    loadDetails: async () => {
      const [name, symbol, totalSupply] = await Promise.all([
        contractInstance.name(),
        contractInstance.symbol(),
        contractInstance.totalSupply(),
      ])

      return {
        name,
        symbol,
        totalSupply,
      }
    },
  }
}
