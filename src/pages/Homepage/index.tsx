import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/mini'

export default function Homepage({ ...rest }: ComponentProps<'div'>) {
  const {
    formState: { errors },

    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(
      z.object({
        email: z.email(),
        password: z.string().check(z.minLength(6)),
      }),
    ),
  })

  return (
    <div {...rest}>
      <h1 className='typography-m3-display-large'>HELLO WORLD</h1>

      <input {...register('email')} type='text' />
      {errors.email && <span>{errors.email.message}</span>}
    </div>
  )
}
