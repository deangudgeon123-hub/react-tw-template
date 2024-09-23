import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

import { UiContainer } from '@/ui'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  return (
    <motion.div {...rest}>
      <UiContainer>hello world!</UiContainer>
    </motion.div>
  )
}
