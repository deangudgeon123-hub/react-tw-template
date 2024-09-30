import { HTMLAttributes, useCallback, useState } from 'react'
import { Connector } from 'wagmi'

import { useWeb3Context } from '@/contexts/Web3Provider'
import { ErrorHandler } from '@/helpers'
import { cn } from '@/theme/utils'
import { UiCollapse, UiLogo } from '@/ui'

export default function UiNavbar({ ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { connectManager, address, chain, connect, disconnect } =
    useWeb3Context()

  const [isConnectorsListOpen, setIsConnectorsListOpen] = useState(false)

  const tryConnect = useCallback(
    (connector: Connector) => {
      try {
        connect(connector)
      } catch (error) {
        ErrorHandler.process(error)
      }

      setIsConnectorsListOpen(false)
    },
    [connect],
  )

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

      <div className='flex gap-4 items-center relative'>
        {address ? (
          <div className={'flex gap-4'}>
            {address}

            <button onClick={tryDisconnect}>Disconnect</button>
          </div>
        ) : (
          <>
            <button
              className=''
              onClick={() => setIsConnectorsListOpen(prev => !prev)}
            >
              Connect
            </button>

            <UiCollapse
              isOpen={isConnectorsListOpen}
              className={
                'absolute top-[100%] right-0 bg-componentDisabled p-4 rounded-2xl'
              }
            >
              <div className='flex flex-col gap-4'>
                {connectManager.connectors.map((connector, index) => (
                  <button key={index} onClick={() => tryConnect(connector)}>
                    {connector?.name}
                  </button>
                ))}
              </div>
            </UiCollapse>
          </>
        )}
      </div>

      <span className=''>chainID: {chain?.id}</span>
    </div>
  )
}
