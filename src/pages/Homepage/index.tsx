import { ComponentProps } from 'react'

export default function Homepage({ ...rest }: ComponentProps<'div'>) {
  return <div {...rest}></div>
}
