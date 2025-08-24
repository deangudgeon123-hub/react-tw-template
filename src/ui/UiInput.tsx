import * as React from 'react'
import { ReactNode } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { v4 } from 'uuid'

import { cn } from '@/theme/utils'

import { UiCollapsible } from './UiCollapsible'
import { UiLabel } from './UiLabel'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export type ControlledUiInputProps<T extends FieldValues> =
  React.ComponentProps<'input'> & {
    label?: ReactNode
    leadingContent?: ReactNode
    trailingContent?: ReactNode
  } & UseControllerProps<T>

function ControlledUiInput<T extends FieldValues>({
  name,
  control,
  rules,
  label,
  leadingContent,
  trailingContent,
  ...rest
}: ControlledUiInputProps<T>) {
  const id = React.useMemo(() => v4(), [])
  const { field, fieldState } = useController({ control, name, rules: rules })

  return (
    <div className='flex flex-col items-start gap-2'>
      {label &&
        (() => {
          return (
            <UiLabel
              className='text-muted-foreground typography-m3-label-medium!'
              htmlFor={id}
            >
              {label}
            </UiLabel>
          )
        })()}
      <div className='relative isolate flex w-full'>
        {leadingContent}
        <Input
          {...rest}
          id={id}
          ref={field.ref}
          autoCapitalize='none'
          onChange={e => {
            rest.onChange?.(e)
            field.onChange(e)
          }}
          value={field.value}
        />
        {trailingContent}
      </div>

      <UiCollapsible open={!!fieldState.error?.message} className='w-full'>
        <span className='text-destructive typography-m3-body-small'>
          {fieldState.error?.message}
        </span>
      </UiCollapsible>
    </div>
  )
}

export { ControlledUiInput, Input as UiInput }
