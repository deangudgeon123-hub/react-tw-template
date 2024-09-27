import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

import Erc20 from '@/pages/Homepage/components/erc20'
import { sampleStore } from '@/store/sample'
import { UiContainer, UiDivider } from '@/ui'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  const state1 = sampleStore.useSampleStore(state => state.state1)

  return (
    <motion.div {...rest}>
      <UiContainer className={'gap-4 flex flex-col'}>
        <Erc20 />
        <UiDivider />
        {state1}
      </UiContainer>
    </motion.div>
  )
}
