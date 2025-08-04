import { Time, time } from '@distributedlab/tools'
import enDayjsLocal from 'dayjs/locale/en'
import { BigNumberish, formatUnits, Numeric } from 'ethers'

export const setDayjsLocale = (locale: 'en') => {
  const nextLocale = {
    en: enDayjsLocal,
  }[locale]

  Time.locale(nextLocale)
}

export function handleTimestamp(timestamp: number) {
  if (
    Math.abs(time().timestamp - timestamp) >
    Math.abs(time().timestamp - timestamp / 1000)
  ) {
    return time(timestamp / 1000)
  } else {
    return time(timestamp)
  }
}

export function formatBigNumber(
  value: BigNumberish,
  decimals?: string | Numeric,
  cfg?: {
    fixedPrecision?: number
  },
) {
  try {
    const formattedValue = formatUnits(value, decimals)

    if (cfg?.fixedPrecision) {
      const [integerPart, decimalPart] = formattedValue.split('.')
      const fixedDecimalPart = decimalPart
        ? decimalPart.slice(0, cfg.fixedPrecision)
        : ''
      return `${integerPart}${fixedDecimalPart ? `.${fixedDecimalPart}` : ''}`
    }

    return formattedValue
  } catch (error) {
    return '-'
  }
}

function formatAmountWithSuffix(amount: string | bigint): [string, string] {
  try {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'S', 'O', 'N']
    let suffixIndex = 0
    let formattedAmount = Number(amount)

    while (formattedAmount >= 1000 && suffixIndex < suffixes.length - 1) {
      formattedAmount /= 1000
      suffixIndex++
    }
    return [formattedAmount.toFixed(1), suffixes[suffixIndex]]
  } catch (error) {
    return ['-', '-']
  }
}

export function formatBalance(
  amount: BigNumberish,
  decimals: bigint | number = 18,
): string {
  try {
    const formattedAmount = formatUnits(String(amount), Number(decimals))
    const [convertedAmount, suffix] = formatAmountWithSuffix(formattedAmount)

    const fmtCfg = new Intl.NumberFormat(navigator.language, {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(4, Number(decimals)),
      roundingMode: 'trunc',
      roundingPriority: 'lessPrecision',
    })

    if (suffix) {
      return fmtCfg.format(Number(convertedAmount)) + suffix
    }

    return fmtCfg.format(Number(formattedAmount))
  } catch (error) {
    return '-'
  }
}

export function abbrCenter(addr: string, start = 4, end = 4) {
  return `${addr.slice(0, start)}...${addr.slice(-end)}`
}

export function bnMax(...args: bigint[]) {
  return args.reduce((m, e) => (e > m ? e : m))
}

export function bnMin(...args: bigint[]) {
  return args.reduce((m, e) => (e < m ? e : m))
}
