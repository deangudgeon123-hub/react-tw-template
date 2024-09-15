import { motion, MotionProps } from 'framer-motion'
import { HTMLAttributes } from 'react'

import { cn } from '@/theme/utils'
import { UiContainer } from '@/ui'

type Props = HTMLAttributes<HTMLDivElement> & MotionProps

export default function Homepage({ ...rest }: Props) {
  return (
    <motion.div {...rest} className={cn(rest.className, '')}>
      <UiContainer>Homepage</UiContainer>
    </motion.div>
  )
}
