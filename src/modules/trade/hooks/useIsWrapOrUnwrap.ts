import { useMemo } from 'react'

import { NATIVE_CURRENCY_BUY_TOKEN } from 'legacy/constants'
import { WRAPPED_NATIVE_CURRENCY } from 'legacy/constants/tokens'
import { supportedChainId } from 'legacy/utils/supportedChainId'

import { useTradeState } from 'modules/trade/hooks/useTradeState'
import { useWalletInfo } from 'modules/wallet'

import { checkBySymbolAndAddress } from 'utils/checkBySymbolAndAddress'

export function useIsWrapOrUnwrap(): boolean {
  const { chainId } = useWalletInfo()
  const { state } = useTradeState()
  const { inputCurrencyId, outputCurrencyId } = state || {}

  return useMemo(() => {
    if (!chainId || !supportedChainId(chainId)) return false

    if (!inputCurrencyId || !outputCurrencyId) return false

    const nativeToken = NATIVE_CURRENCY_BUY_TOKEN[chainId]
    const wrappedToken = WRAPPED_NATIVE_CURRENCY[chainId]

    const isNativeIn = checkBySymbolAndAddress(nativeToken, inputCurrencyId)
    const isNativeOut = checkBySymbolAndAddress(nativeToken, outputCurrencyId)

    const isWrappedIn = checkBySymbolAndAddress(wrappedToken, inputCurrencyId)
    const isWrappedOut = checkBySymbolAndAddress(wrappedToken, outputCurrencyId)

    return (isNativeIn && isWrappedOut) || (isNativeOut && isWrappedIn)
  }, [chainId, inputCurrencyId, outputCurrencyId])
}
