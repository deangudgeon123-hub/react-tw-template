import { HTMLAttributes, useCallback } from 'react'

import { useWeb3Context } from '@/contexts/Web3Provider'
import { ErrorHandler } from '@/helpers'
import { cn } from '@/theme/utils'
import { UiLogo } from '@/ui'

export default function UiNavbar({ ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { address, chain, connect } = useWeb3Context()

  const tryConnect = useCallback(() => {
    try {
      connect()
    } catch (error) {
      ErrorHandler.process(error)
    }
  }, [connect])

  return (
    <div
      {...rest}
      className={cn('flex items-center gap-6 py-8 px-0', rest.className)}
    >
      <UiLogo className='mr-auto' />

      <div className='flex gap-4 items-center'>
        {address || (
          <button className='' onClick={tryConnect}>
            connect
          </button>
        )}
      </div>

      <span className=''>chainID: {chain.id}</span>
    </div>
  )
}
