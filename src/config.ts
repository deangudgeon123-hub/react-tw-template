import { LogLevelDesc } from 'loglevel'
import { z } from 'zod'

import packageJson from '../package.json'

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_APP_NAME: z.string(),
  VITE_APP_BUILD_VERSION: z.string().optional(),
})

export const config = {
  BUILD_VERSION: packageJson.version,
  ...envSchema.parse(import.meta.env),
  LOG_LEVEL: 'trace' as LogLevelDesc,
  erc20Token: '0x08BE00b659713E615795954B778dbacD1F14efEb',
}
