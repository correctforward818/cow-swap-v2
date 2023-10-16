import { useMemo } from 'react'

import { useWalletInfo } from '@cowprotocol/wallet'
import { Token } from '@uniswap/sdk-core'

import { useProxyTokens } from 'api/proxy'

export function useExternalTokenSearch(query: string, existingTokens: Map<string, boolean>): Token[] {
  const { chainId: currentChainId } = useWalletInfo()
  const result = useProxyTokens(query)
  const tokens = useMemo(
    () =>
      result
        .filter(({ address, chainId }) => !existingTokens.get(address) && chainId === currentChainId)
        .map(({ chainId, address, decimals, symbol, name }) => new Token(chainId, address, decimals, symbol, name)),
    [result, existingTokens, currentChainId]
  )

  return tokens
}
