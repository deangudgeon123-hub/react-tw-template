import { motion, MotionProps } from 'motion/react'
import { HTMLAttributes } from 'react'

import { useToastsManager } from '@/contexts'
import { IconNames } from '@/enums'
import { bus, BusEvents } from '@/helpers'
import Erc20 from '@/pages/Homepage/components/erc20'
import { sampleStore } from '@/store/sample'
import UiIcon from '@/ui/UiIcon'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  const state1 = sampleStore.useSampleStore(state => state.state1)

  const toastManager = useToastsManager()

  const testToasts = () => {
    bus.emit(BusEvents.Success, 'Success')
    bus.emit(BusEvents.Error, 'Error')
    bus.emit(BusEvents.Warning, 'Warning')
    bus.emit(BusEvents.Info, 'Info')

    toastManager.showToast(
      'success',
      <div className='flex flex-col gap-2'>
        <UiIcon
          name={IconNames.Microphone}
          className={'size-8 text-errorDark'}
        />
        <span className='typography-h4'>Hello world</span>
        <button className='w-min whitespace-nowrap bg-primaryMain px-4 py-3 text-white'>
          Press me
        </button>
      </div>,
    )
  }

  return (
    <motion.div {...rest}>
      <Erc20 />
      {state1}
      <button
        className='w-min whitespace-nowrap bg-primaryMain px-4 py-3 text-textPrimary'
        onClick={testToasts}
      >
        Test toasts
      </button>
    </motion.div>
  )
}
