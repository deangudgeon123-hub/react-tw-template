import Emittery from 'emittery'

import type { ToastPayload } from '@/contexts/ToastsManager'

export const emitter = new Emittery<{
  error: Partial<ToastPayload>
  warning: Partial<ToastPayload>
  success: Partial<ToastPayload>
  info: Partial<ToastPayload>
}>()
