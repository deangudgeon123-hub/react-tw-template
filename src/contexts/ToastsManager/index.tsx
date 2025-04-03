import {
  createContext,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  type Id,
  toast,
  ToastContainer,
  TypeOptions as ToastTypes,
} from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'

import { IconNames } from '@/enums'
import { emitter } from '@/helpers/event-bus'
import { cn } from '@/theme/utils'
import UiIcon from '@/ui/UiIcon'

const STATUS_MESSAGE_AUTO_HIDE_DURATION = 30 * 1000

export type ToastPayload = {
  title: string
  message: string
  iconName: IconNames
}

interface ToastsManagerContextValue {
  showToast: (
    messageType: ToastTypes,
    payload: ToastPayload | ReactNode,
  ) => void
  removeToast: (toastId: Id) => void
}

const toastsManagerContext = createContext<ToastsManagerContextValue>({
  showToast: () => {},
  removeToast: () => {},
})

const abortController = new AbortController()

export const ToastsManager = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation()

  const defaultTitles = useMemo<Record<ToastTypes, string>>(
    () => ({
      success: t('notifications.default-title-success'),
      error: t('notifications.default-title-error'),
      warning: t('notifications.default-title-warning'),
      info: t('notifications.default-title-info'),
      default: t('notifications.default-title-default'),
    }),
    [t],
  )

  const defaultMessages = useMemo<Record<ToastTypes, string>>(
    () => ({
      default: t('notifications.default-message-default'),
      info: t('notifications.default-message-info'),
      success: t('notifications.default-message-success'),
      error: t('notifications.default-message-error'),
      warning: t('notifications.default-message-warning'),
    }),
    [t],
  )

  const defaultIconNames = useMemo<Record<ToastTypes, IconNames>>(
    () => ({
      default: IconNames.Exclamation,
      info: IconNames.Exclamation,
      success: IconNames.Check,
      error: IconNames.ShieldExclamation,
      warning: IconNames.ShieldExclamation,
    }),
    [],
  )

  const showToast = useCallback(
    (
      messageType: ToastTypes = 'info',
      payload?: Partial<ToastPayload> | ReactNode,
    ) => {
      let content: ReactNode = null

      if (isValidElement(payload)) {
        content = <DefaultToast payload={payload as ReactNode} />
      } else {
        const msgPayload = payload as ToastPayload

        const title = msgPayload?.title || defaultTitles[messageType]
        const message = msgPayload?.message || defaultMessages[messageType]
        const iconName = msgPayload?.iconName || defaultIconNames[messageType]

        content = (
          <DefaultToast
            payload={{
              title,
              message,
              iconName,
            }}
          />
        )
      }

      return toast(() => content, {
        toastId: `${messageType}-${uuidv4()}`,
        icon: false,
        type: messageType,
        className: 'toast',
        autoClose: STATUS_MESSAGE_AUTO_HIDE_DURATION,
        closeOnClick: false,
        position: 'top-right',
      })
    },
    [defaultIconNames, defaultMessages, defaultTitles],
  )

  const removeToast = useCallback((toastId: Id) => {
    toast.dismiss(toastId)
  }, [])

  const showSuccessToast = useCallback(
    (payload: Partial<ToastPayload>) => {
      showToast('success', payload)
    },
    [showToast],
  )
  const showWarningToast = useCallback(
    (payload: Partial<ToastPayload>) => {
      showToast('warning', payload)
    },
    [showToast],
  )
  const showErrorToast = useCallback(
    (payload: Partial<ToastPayload>) => {
      showToast('error', payload)
    },
    [showToast],
  )
  const showInfoToast = useCallback(
    (payload: Partial<ToastPayload>) => {
      showToast('info', payload)
    },
    [showToast],
  )

  useEffect(() => {
    emitter.on('success', showSuccessToast)
    emitter.on('warning', showWarningToast)
    emitter.on('error', showErrorToast)
    emitter.on('info', showInfoToast)

    return () => abortController.abort()
  }, [showErrorToast, showInfoToast, showSuccessToast, showWarningToast])

  return (
    <toastsManagerContext.Provider
      value={{
        showToast,
        removeToast,
      }}
    >
      {children}

      <ToastContainer />
    </toastsManagerContext.Provider>
  )
}

function DefaultToast({
  payload,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  payload: ToastPayload | ReactNode
}) {
  if (isValidElement(payload)) {
    return <div {...rest}>{payload}</div>
  }

  const msgPayload = payload as ToastPayload

  return (
    <div
      {...rest}
      className={cn('flex flex-col items-start gap-2', rest.className)}
    >
      <div className='flex items-center gap-2'>
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-full bg-componentPrimary',
          )}
        >
          <UiIcon
            className='size-4 text-textPrimary'
            name={msgPayload.iconName}
          />
        </div>
        <span className='typography-subtitle3'>{msgPayload.title}</span>
      </div>
      <span className=''>{msgPayload.message}</span>
    </div>
  )
}

export const useToastsManager = () => useContext(toastsManagerContext)
