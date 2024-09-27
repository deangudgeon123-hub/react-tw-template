import { HTMLAttributes, useCallback } from 'react'

import { useWeb3Context } from '@/contexts/Web3Provider'
import { ErrorHandler } from '@/helpers'
import { cn } from '@/theme/utils'
import { UiLogo } from '@/ui'

export default function UiNavbar({ ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { address, chain, connect, disconnect } = useWeb3Context()

  const tryConnect = useCallback(() => {
    try {
      connect()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [connect])

  const tryDisconnect = useCallback(() => {
    try {
      disconnect()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [disconnect])

  return (
    <div
      {...rest}
      className={cn('flex items-center gap-6 py-8 px-0', rest.className)}
    >
      <UiLogo className='mr-auto' />

      <div className='flex gap-4 items-center'>
        {address ? (
          <div className={'flex gap-4'}>
            {address}

            <button onClick={tryDisconnect}>Disconnect</button>
          </div>
        ) : (
          <button className='' onClick={tryConnect}>
            Connect
          </button>
        )}
      </div>

      <span className=''>chainID: {chain.id}</span>
    </div>
  )
}
