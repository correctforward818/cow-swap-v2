import { ExtensibleFallbackContext } from '../hooks/useExtensibleFallbackContext'
import { COMPOSABLE_COW_ADDRESS } from 'modules/advancedOrders/const'
import { getSignatureVerifierContract } from './getSignatureVerifierContract'

export enum ExtensibleFallbackVerification {
  HAS_EXTENSIBLE_FALLBACK,
  HAS_DOMAIN_VERIFIER,
  HAS_NOTHING,
}

/**
 * The function verifies if a safe has ExtensibleFallback and contains ComposableCow contract as domain verifier
 */
export async function verifyExtensibleFallback(
  context: ExtensibleFallbackContext
): Promise<ExtensibleFallbackVerification> {
  const { chainId, safeAppsSdk, settlementContract } = context
  const composableCowContractAddress = COMPOSABLE_COW_ADDRESS[chainId]
  const { safeAddress } = await safeAppsSdk.safe.getInfo()
  const domainSeparator = await settlementContract.callStatic.domainSeparator()

  const signatureVerifierContract = await getSignatureVerifierContract(context)

  try {
    const domainVerifier = await signatureVerifierContract.callStatic.domainVerifiers(safeAddress, domainSeparator)

    if (domainVerifier.toLowerCase() === composableCowContractAddress.toLowerCase()) {
      return ExtensibleFallbackVerification.HAS_DOMAIN_VERIFIER
    }

    return ExtensibleFallbackVerification.HAS_EXTENSIBLE_FALLBACK
  } catch (e) {
    return ExtensibleFallbackVerification.HAS_NOTHING
  }
}
