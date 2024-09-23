import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

import Erc20 from '@/pages/Homepage/components/erc20'
import { UiContainer } from '@/ui'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  return (
    <motion.div {...rest}>
      <UiContainer>
        <Erc20 />
      </UiContainer>
    </motion.div>
  )
}
