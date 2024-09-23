import { getContract } from 'viem'

import { erc20Abi } from '@/abis'
import { useWeb3Context } from '@/contexts/Web3Provider'

export const useErc20 = (address: `0x${string}`) => {
  const { client } = useWeb3Context()

  const instance = getContract({
    address: address,
    abi: erc20Abi,
    client: client,
  })

  return instance
}
