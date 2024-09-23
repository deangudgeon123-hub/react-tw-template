import { config } from '@config'
import { useCallback, useEffect, useState } from 'react'
import { formatEther, parseEther } from 'viem'

import { useWeb3Context } from '@/contexts/Web3Provider'
import { useErc20 } from '@/contexts/Web3Provider/contracts'
import { bus, BusEvents, ErrorHandler } from '@/helpers'

export default function Erc20() {
  const { address, chain } = useWeb3Context()

  const erc20ContractInstance = useErc20(config.erc20Token)

  const [balance, setBalance] = useState('')

  const loadBalance = useCallback(async () => {
    if (!address) return

    const balanceResponse = await erc20ContractInstance.read.balanceOf([
      address,
    ])
    console.log(balanceResponse)

    setBalance(formatEther(balanceResponse))
  }, [address, erc20ContractInstance])

  const transfer = useCallback(async () => {
    if (!address) throw new Error('no address')

    try {
      const hash = await erc20ContractInstance.write.transfer(
        ['0x22CE5fa2c98148E56b5d7e6c927811AF30B8eD9C', parseEther('1')],
        // FIXME: ain't want to pass this every time
        {
          account: address,
          chain: chain,
        },
      )
      bus.emit(BusEvents.Success, {
        message: `tx sent, ${hash}`,
      })
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [erc20ContractInstance])

  useEffect(() => {
    loadBalance()

    // eslint-disable-next-line
  }, [])

  return (
    <div className='flex'>
      <span className='m-4'>{balance}</span>
      <br />
      <button onClick={transfer}>transfer</button>
    </div>
  )
}
