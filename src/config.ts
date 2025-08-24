import { AppKitNetwork } from '@reown/appkit/networks'
import { holesky, mainnet, polygonAmoy, sepolia } from '@reown/appkit/networks'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { LogLevelDesc } from 'loglevel'
import { http } from 'viem'
import { z } from 'zod/mini'

import packageJson from '../package.json'

const envSchema = z.object({
  VITE_APP_NAME: z._default(z.string(), 'React TW Template'),
  VITE_API_URL: z.nullable(z.optional(z.string())),
})

export const config = {
  BUILD_VERSION: packageJson.version,
  LOG_LEVEL: 'trace' as LogLevelDesc,
  MODE: import.meta.env.MODE,
  ...envSchema.parse(import.meta.env),

  DISCORD_LINK: 'https://discord.com/invite/confidentiallayer',
  X_LINK: 'https://x.com/ConfidentialLyr',
}

export const projectId = '41f8085dc01ff1ca42c6efcb2c12c169'

export const metadata = {
  name: `${config.VITE_APP_NAME} AppKit`,
  description: `AppKit ${config.VITE_APP_NAME}`,
  url: window.origin,
  icons: [`${window.origin}/branding/logo.svg`],
}

const ethNetworks: [AppKitNetwork, ...AppKitNetwork[]] =
  config.MODE === 'production' ? [mainnet] : [sepolia, polygonAmoy]

export const wagmiAdapter = new WagmiAdapter({
  networks: [...ethNetworks],
  projectId,
  transports: {
    [holesky.id]: http(),
  },
})

export const initAppKit = () => {
  createAppKit({
    adapters: [wagmiAdapter],
    networks: [...ethNetworks],
    enableCoinbase: false,
    allowUnsupportedChain: true,
    projectId,
    metadata,
    features: {
      analytics: false,
      email: false,
      socials: false,
    },
    allWallets: 'HIDE',
  })
}

initAppKit()
