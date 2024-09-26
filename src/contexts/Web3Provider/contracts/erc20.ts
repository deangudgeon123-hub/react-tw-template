import { AbstractProvider, AbstractSigner } from 'ethers'

import { createContract } from '@/contexts/Web3Provider/helpers/contracts'
import { Erc20__factory } from '@/contexts/Web3Provider/types'

export function createErc20Contract(
  address: string,
  provider: AbstractProvider | AbstractSigner,
) {
  const { contractInstance, contractInterface } = createContract(
    address,
    provider,
    Erc20__factory,
  )

  return {
    contractInstance,
    contractInterface,

    loadDetails: async () => {
      const [decimals, name, owner, symbol, totalSupply] = await Promise.all([
        contractInstance.decimals(),
        contractInstance.name(),
        contractInstance.owner(),
        contractInstance.symbol(),
        contractInstance.totalSupply(),
      ])

      return {
        decimals,
        name,
        owner,
        symbol,
        totalSupply,
      }
    },
  }
}
