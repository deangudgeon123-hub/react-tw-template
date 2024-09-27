import { config } from '@config'
import { useCallback, useEffect, useMemo } from 'react'
import { parseEther } from 'viem'

import { useWeb3Context } from '@/contexts/Web3Provider'
import { createErc20Contract } from '@/contexts/Web3Provider/contracts'
import { getSignerOrProvider } from '@/contexts/Web3Provider/helpers/providers'
import { ErrorHandler } from '@/helpers'

export default function Erc20() {
  const { address, client } = useWeb3Context()

  const erc20Contract = useMemo(() => {
    const jsonRpcSignerOrProvider = getSignerOrProvider(client)

    return createErc20Contract(config.erc20Token, jsonRpcSignerOrProvider)
  }, [client])

  const loadBalance = useCallback(async () => {
    // if (!address) return

    const [details, balance] = await Promise.all([
      erc20Contract.loadDetails(),
      erc20Contract.contractInstance.balanceOf(
        '0x22CE5fa2c98148E56b5d7e6c927811AF30B8eD9C',
      ),
    ])

    // eslint-disable-next-line
    console.log(details, balance)

    // console.log(details, balance)
    //
    // if (!balance) return
    //
    // setBalance(formatEther(balance))
  }, [erc20Contract])

  const transfer = useCallback(async () => {
    if (!address) throw new Error('no address')

    try {
      const tx = await erc20Contract.contractInstance.transfer(
        '0x22CE5fa2c98148E56b5d7e6c927811AF30B8eD9C',
        parseEther('1'),
      )

      const receipt = await tx.wait()

      // eslint-disable-next-line
      console.log(receipt)
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [address, erc20Contract.contractInstance])

  useEffect(() => {
    loadBalance()

    // eslint-disable-next-line
  }, [])

  return (
    <div className='flex'>
      <button onClick={transfer}>transfer</button>
    </div>
  )
}
