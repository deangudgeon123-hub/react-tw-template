'use client'

import { AlertCircleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react'
import {
  ComponentPropsWithoutRef,
  ReactNode,
  useCallback,
  useEffect,
} from 'react'
import { toast, Toaster as Sonner } from 'sonner'

import { useTheme } from '@/contexts/ThemeProvider'
import { emitter } from '@/helpers'
import { cn } from '@/theme/utils'

type ToasterProps = React.ComponentProps<typeof Sonner>

export type DefaultToastPayload = {
  title: string
  message: string
  icon: ReactNode
}

const abortController = new AbortController()

const DEFAULT_DURATION = 5_000

const UiToaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  const showSuccessToast = useCallback(
    (payload: Partial<DefaultToastPayload>) => {
      toast(
        <DefaultToast
          payload={{
            ...payload,
            icon: payload.icon || <CheckCircle2Icon size={24} />,
          }}
          className='bg-success'
        />,
        {
          duration: DEFAULT_DURATION,
        },
      )
    },
    [],
  )
  const showWarningToast = useCallback(
    (payload: Partial<DefaultToastPayload>) => {
      toast(
        <DefaultToast
          payload={{
            ...payload,
            icon: payload.icon || <AlertCircleIcon size={24} />,
          }}
          className='bg-orange-500'
        />,
        {
          duration: DEFAULT_DURATION,
        },
      )
    },
    [],
  )
  const showErrorToast = useCallback(
    (payload: Partial<DefaultToastPayload>) => {
      toast(
        <DefaultToast
          payload={{
            ...payload,
            icon: payload.icon || <AlertCircleIcon size={24} />,
          }}
          className='bg-red-500'
        />,
        {
          duration: DEFAULT_DURATION,
        },
      )
    },
    [],
  )
  const showInfoToast = useCallback((payload: Partial<DefaultToastPayload>) => {
    toast(
      <DefaultToast
        payload={{
          ...payload,
          icon: payload.icon || <InfoIcon size={24} />,
        }}
        className='bg-blue-500'
      />,
      {
        duration: DEFAULT_DURATION,
      },
    )
  }, [])

  useEffect(() => {
    emitter.on('success', showSuccessToast)
    emitter.on('warning', showWarningToast)
    emitter.on('error', showErrorToast)
    emitter.on('info', showInfoToast)

    return () => {
      emitter.off('success', showSuccessToast)
      emitter.off('warning', showWarningToast)
      emitter.off('error', showErrorToast)
      emitter.off('info', showInfoToast)
      abortController.abort()
    }
  }, [showErrorToast, showInfoToast, showSuccessToast, showWarningToast])

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: cn('p-0'),
          // 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: cn(),
          // 'group-[.toast]:text-muted-foreground'
          actionButton: cn(),
          // 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: cn(),
          // 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { UiToaster }

function DefaultToast({
  payload,
  className,
  ...rest
}: {
  payload: Partial<DefaultToastPayload>
} & ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...rest}
      className={cn(
        'text-foreground flex min-w-[340px] items-start gap-4 rounded-xl p-4',
        className,
      )}
    >
      {payload.icon ?? <InfoIcon className='text-inherit' size={24} />}
      <div className='flex flex-col'>
        <p className='text-foreground typography-m3-body-medium font-semibold'>
          {payload.title}
        </p>
        {payload.message && (
          <p className='text-foreground text-sm'>{payload.message}</p>
        )}
      </div>
    </div>
  )
}
