import { useWeb3React } from '@web3-react/core'
import { useWalletInfo } from 'hooks/useWalletInfo'
import { useDerivedSwapInfo, useSwapActionHandlers } from 'state/swap/hooks'
import { useExpertModeManager } from 'state/user/hooks'
import { useToggleWalletModal } from 'state/application/hooks'
import { useSwapConfirmManager } from '@cow/modules/swap/hooks/useSwapConfirmManager'
import { Field } from 'state/swap/actions'
import { TradeType } from '@uniswap/sdk-core'
import { computeSlippageAdjustedAmounts } from 'utils/prices'
import {
  useHasEnoughWrappedBalanceForSwap,
  useWrapCallback,
  useWrapType,
  useWrapUnwrapError,
} from 'hooks/useWrapCallback'
import { useCallback } from 'react'
import { logSwapFlow } from '@cow/modules/swap/services/utils/logger'
import { swapFlow } from '@cow/modules/swap/services/swapFlow'
import { useGnosisSafeInfo } from 'hooks/useGnosisSafeInfo'
import { useIsSwapUnsupported } from 'hooks/useIsSwapUnsupported'
import { getSwapButtonState } from '@cow/modules/swap/helpers/getSwapButtonState'
import { SwapButtonsContext } from '@cow/modules/swap/pure/SwapButtons'
import { useGetQuoteAndStatus } from 'state/price/hooks'
import { useSwapFlowContext } from '@cow/modules/swap/hooks/useSwapFlowContext'
import { PriceImpact } from 'hooks/usePriceImpact'
import { useTradeApproveState } from '@cow/common/containers/TradeApprove/useTradeApproveState'
import { useDetectNativeToken } from '@cow/modules/swap/hooks/useDetectNativeToken'
import { useEthFlowContext } from '@cow/modules/swap/hooks/useEthFlowContext'
import { ethFlow } from '@cow/modules/swap/services/ethFlow'

export interface SwapButtonInput {
  feeWarningAccepted: boolean
  impactWarningAccepted: boolean
  priceImpactParams: PriceImpact
  openNativeWrapModal(): void
}

export function useSwapButtonContext(input: SwapButtonInput): SwapButtonsContext {
  const { feeWarningAccepted, impactWarningAccepted, openNativeWrapModal, priceImpactParams } = input

  const { account, chainId } = useWeb3React()
  const { isSupportedWallet } = useWalletInfo()
  const {
    v2Trade: trade,
    allowedSlippage,
    parsedAmount,
    currencies,
    currenciesIds,
    inputError: swapInputError,
  } = useDerivedSwapInfo()
  const [isExpertMode] = useExpertModeManager()
  const toggleWalletModal = useToggleWalletModal()
  const { openSwapConfirmModal } = useSwapConfirmManager()
  const swapFlowContext = useSwapFlowContext()
  const ethFlowContext = useEthFlowContext()
  const { onCurrencySelection } = useSwapActionHandlers()

  const currencyIn = currencies[Field.INPUT]
  const currencyOut = currencies[Field.OUTPUT]

  const { quote, isGettingNewQuote } = useGetQuoteAndStatus({
    token: currenciesIds.INPUT,
    chainId,
  })

  const { isNativeIn, isWrappedOut, wrappedToken } = useDetectNativeToken()
  const isNativeInSwap = isNativeIn && !isWrappedOut

  const nativeInput = !!(trade?.tradeType === TradeType.EXACT_INPUT)
    ? trade?.inputAmount
    : // else use the slippage + fee adjusted amount
      computeSlippageAdjustedAmounts(trade, allowedSlippage).INPUT
  const wrapUnwrapAmount = isNativeInSwap ? (nativeInput || parsedAmount)?.wrapped : nativeInput || parsedAmount
  const wrapType = useWrapType()
  const wrapInputError = useWrapUnwrapError(wrapType, wrapUnwrapAmount)
  const hasEnoughWrappedBalanceForSwap = useHasEnoughWrappedBalanceForSwap(wrapUnwrapAmount)
  const wrapCallback = useWrapCallback(wrapUnwrapAmount)
  const approvalState = useTradeApproveState(parsedAmount || null)

  const handleSwap = useCallback(() => {
    if (!swapFlowContext && !ethFlowContext) return

    if (swapFlowContext) {
      logSwapFlow('SWAP FLOW', 'Start swap flow')
      swapFlow(swapFlowContext, priceImpactParams)
    } else if (ethFlowContext) {
      logSwapFlow('ETH FLOW', 'Start eth flow')
      ethFlow(ethFlowContext, priceImpactParams)
    }
  }, [swapFlowContext, ethFlowContext, priceImpactParams])

  const contextExists = ethFlowContext || swapFlowContext
  const swapCallbackError = contextExists ? null : 'Missing dependencies'

  const isReadonlyGnosisSafeUser = useGnosisSafeInfo()?.isReadOnly || false
  const isSwapSupported = useIsSwapUnsupported(currencyIn, currencyOut)

  const swapButtonState = getSwapButtonState({
    account,
    isSupportedWallet,
    isReadonlyGnosisSafeUser,
    isExpertMode,
    isSwapSupported,
    isNativeIn: isNativeInSwap,
    wrappedToken,
    wrapType,
    wrapInputError,
    quoteError: quote?.error,
    inputError: swapInputError,
    approvalState,
    feeWarningAccepted,
    impactWarningAccepted,
    isGettingNewQuote,
    swapCallbackError,
    trade,
  })

  return {
    swapButtonState,
    inputAmount: parsedAmount,
    chainId,
    wrappedToken,
    handleSwap,
    wrapInputError,
    wrapUnwrapAmount,
    hasEnoughWrappedBalanceForSwap,
    onWrapOrUnwrap: wrapCallback,
    onEthFlow() {
      openNativeWrapModal()
    },
    openSwapConfirm() {
      trade && openSwapConfirmModal(trade)
    },
    toggleWalletModal,
    swapInputError,
    onCurrencySelection,
  }
}
