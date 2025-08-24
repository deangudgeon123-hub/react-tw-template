import { zodResolver } from '@hookform/resolvers/zod'
import type { DefaultValues, FieldValues } from 'react-hook-form'
import { useForm as useFormHook } from 'react-hook-form'
import { z } from 'zod'

export const useForm = <T extends z.ZodSchema, R extends FieldValues>(
  defaultValues: R,
  schemaBuilder: (zod: typeof z) => T,
) => {
  return useFormHook<R>({
    mode: 'onTouched',
    defaultValues: defaultValues as DefaultValues<R>,
    resolver: zodResolver(schemaBuilder(z)),
  })
}
