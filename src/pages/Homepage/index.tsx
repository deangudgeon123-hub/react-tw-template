import { motion, MotionProps } from 'motion/react'
import { HTMLAttributes } from 'react'

import { useToastsManager } from '@/contexts'
import { IconNames } from '@/enums'
import { emitter } from '@/helpers'
import Erc20 from '@/pages/Homepage/components/erc20'
import { sampleStore } from '@/store/sample'
import UiIcon from '@/ui/UiIcon'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  const state1 = sampleStore.useSampleStore(state => state.state1)

  const toastManager = useToastsManager()

  const testToasts = () => {
    emitter.emit('success', { title: 'Success' })
    emitter.emit('error', { title: 'Error' })
    emitter.emit('warning', { title: 'Warning' })
    emitter.emit('info', { title: 'Info' })

    toastManager.showToast(
      'success',
      <div className='flex flex-col gap-2'>
        <UiIcon
          name={IconNames.Microphone}
          className={'text-errorDark size-8'}
        />
        <span className='typography-m3-headline-large'>Hello world</span>
        <button className='bg-background text-foreground w-min px-4 py-3 whitespace-nowrap'>
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
        className='bg-background text-foreground w-min px-4 py-3 whitespace-nowrap'
        onClick={testToasts}
      >
        Test toasts
      </button>
    </motion.div>
  )
}
