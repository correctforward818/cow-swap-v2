import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getSafeTransaction } from 'api/gnosisSafe'
import { SafeMultisigTransactionResponse } from '@gnosis.pm/safe-service-client'
import { retry, RetryOptions } from 'utils/retry'
import { RetryResult } from '../types'
import { supportedChainId } from 'utils/supportedChainId'

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 1000, maxWait: 3000 }

export type GetSafeInfo = (hash: string) => RetryResult<SafeMultisigTransactionResponse>

export function useGetSafeInfo(): GetSafeInfo {
  const { chainId } = useWeb3React()

  const getSafeInfo = useCallback<GetSafeInfo>(
    (hash) => {
      return retry(() => {
        if (chainId === undefined) {
          throw new Error('No chainId yet')
        }

        if (!supportedChainId(chainId)) {
          throw new Error('Unsupported chainId: ' + chainId)
        }

        return getSafeTransaction(chainId, hash)
      }, DEFAULT_RETRY_OPTIONS)
    },
    [chainId]
  )

  return getSafeInfo
}
