import { TradeUrlParams } from 'modules/trade/types/TradeRawState'

import { Routes } from 'constants/routes'

/**
 * When input currency is not set and user select output currency, we build a link like:
 * /limit-orders/_/DAI
 */
export function parameterizeTradeRoute(
  { chainId, inputCurrencyId, outputCurrencyId }: TradeUrlParams,
  route: Routes
): string {
  return route
    .replace('/:chainId?', chainId ? `/${encodeURIComponent(chainId)}` : '')
    .replace('/:inputCurrencyId?', inputCurrencyId ? `/${encodeURIComponent(inputCurrencyId)}` : '/_')
    .replace('/:outputCurrencyId?', outputCurrencyId ? `/${encodeURIComponent(outputCurrencyId)}` : '')
}
