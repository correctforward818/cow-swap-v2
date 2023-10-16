import { useCallback, useEffect, useMemo } from 'react'

import { usePrevious } from '@cowprotocol/common-hooks'
import { getProviderErrorMessage } from '@cowprotocol/common-utils'
import { useENS } from '@cowprotocol/ens'
import { Loader } from '@cowprotocol/ui'
import { useWalletInfo } from '@cowprotocol/wallet'

import Confetti from 'legacy/components/Confetti'
import { useErrorModal } from 'legacy/hooks/useErrorMessageAndModal'
import useTransactionConfirmationModal from 'legacy/hooks/useTransactionConfirmationModal'
import { useToggleWalletModal } from 'legacy/state/application/hooks'
import { ClaimStatus } from 'legacy/state/claim/actions'
import { useUserEnhancedClaimData, useUserUnclaimedAmount, useClaimCallback } from 'legacy/state/claim/hooks'
import { useClaimDispatchers, useClaimState } from 'legacy/state/claim/hooks'
import { ClaimInput } from 'legacy/state/claim/hooks/types'
import { getFreeClaims, hasPaidClaim, hasFreeClaim, prepareInvestClaims } from 'legacy/state/claim/hooks/utils'
import ClaimsOnOtherChainsUpdater from 'legacy/state/claim/updater'
import { ConfirmOperationType } from 'legacy/state/types'

import { PageWrapper, InnerPageWrapper } from 'pages/Claim/styled'

import CanUserClaimMessage from './CanUserClaimMessage'
import ClaimAddress from './ClaimAddress'
import ClaimBanner from './ClaimBanner'
import ClaimingStatus from './ClaimingStatus'
import ClaimNav from './ClaimNav'
import ClaimsOnOtherChainsBanner from './ClaimsOnOtherChainsBanner'
import ClaimsTable from './ClaimsTable'
import { ClaimSummary } from './ClaimSummary'
import FooterNavButtons from './FooterNavButtons'
import InvestmentFlow from './InvestmentFlow'

export default function Claim() {
  const { account, chainId } = useWalletInfo()

  // get previous account
  const previousAccount = usePrevious(account)

  const {
    // address/ENS address
    inputAddress,
    // account
    activeClaimAccount,
    // check address
    isSearchUsed,
    // claiming
    claimStatus,
    // investment
    investFlowStep,
    // table select change
    selected,
    // investFlowData
    investFlowData,
  } = useClaimState()

  const {
    // account
    setInputAddress,
    setActiveClaimAccount,
    setActiveClaimAccountENS,
    // search
    setIsSearchUsed,
    // claiming
    setClaimStatus,
    setClaimedAmount,
    setEstimatedGas,
    // investing
    setIsInvestFlowActive,
    // claim row selection
    setSelected,
    // reset claim ui
    resetClaimUi,
  } = useClaimDispatchers()

  // addresses
  const { address: resolvedAddress, name: resolvedENS } = useENS(inputAddress)

  // toggle wallet when disconnected
  const toggleWalletModal = useToggleWalletModal()
  // error handling modals
  const { handleCloseError, handleSetError, ErrorModal } = useErrorModal()

  // get user claim data
  const {
    isClaimed,
    claims: userClaimData,
    isLoading: isClaimDataLoading,
  } = useUserEnhancedClaimData(activeClaimAccount)

  // get total unclaimed amount
  const unclaimedAmount = useUserUnclaimedAmount(activeClaimAccount)

  const hasClaims = useMemo(() => userClaimData.length > 0, [userClaimData])
  const isAirdropOnly = useMemo(() => !hasPaidClaim(userClaimData), [userClaimData])
  const isPaidClaimsOnly = useMemo(() => hasPaidClaim(userClaimData) && !hasFreeClaim(userClaimData), [userClaimData])

  // claim callback
  const { claimCallback, estimateGasCallback } = useClaimCallback(activeClaimAccount)

  // reset claim state
  const resetClaimState = useCallback(
    (account = '', ens = '') => {
      setClaimStatus(ClaimStatus.DEFAULT)
      setActiveClaimAccount(account)
      setActiveClaimAccountENS(ens)
      setSelected([])
    },
    [setActiveClaimAccount, setActiveClaimAccountENS, setClaimStatus, setSelected]
  )

  // handle account change
  const handleAccountChange = useCallback(
    (account = '') => {
      resetClaimState(account)
      setIsSearchUsed(false)
    },
    [resetClaimState, setIsSearchUsed]
  )

  // handle change account click
  const handleChangeClick = useCallback(() => {
    resetClaimState()
    setIsSearchUsed(true)
  }, [resetClaimState, setIsSearchUsed])

  // handle
  const handleCheckClaim = () => {
    setActiveClaimAccount(resolvedAddress || '')
    setActiveClaimAccountENS(resolvedENS || '')
    setInputAddress('')
  }

  // aggregate the input for claim callback
  const claimInputData = useMemo(() => {
    const freeClaims = getFreeClaims(userClaimData)
    const paidClaims = prepareInvestClaims(investFlowData, userClaimData)

    const inputData = freeClaims.map(({ index }) => ({ index }))
    return inputData.concat(paidClaims)
  }, [investFlowData, userClaimData])

  // track gas price estimation for given input data
  useEffect(() => {
    estimateGasCallback(claimInputData).then((gas) => setEstimatedGas(gas?.toString() || ''))
  }, [claimInputData, estimateGasCallback, setEstimatedGas])

  // handle submit claim
  const handleSubmitClaim = useCallback(() => {
    // Reset error handling
    handleCloseError()

    // just to be sure
    if (!activeClaimAccount) return

    const sendTransaction = (inputData: ClaimInput[]) => {
      setClaimStatus(ClaimStatus.ATTEMPTING)
      claimCallback(inputData)
        .then((vCowAmount) => {
          setClaimStatus(ClaimStatus.SUBMITTED)
          setClaimedAmount(vCowAmount)
        })
        .catch((error) => {
          setClaimStatus(ClaimStatus.DEFAULT)
          console.error('[Claim::index::handleSubmitClaim]::error', error)
          handleSetError(getProviderErrorMessage(error))
        })
    }

    // check if there are any selected (paid) claims
    if (!selected.length) {
      console.log('Starting claiming with', claimInputData)
      sendTransaction(claimInputData)
    } else if (investFlowStep === 2) {
      console.log('Starting claiming with', claimInputData)
      sendTransaction(claimInputData)
    } else {
      setIsInvestFlowActive(true)
    }
  }, [
    handleCloseError,
    activeClaimAccount,
    selected.length,
    investFlowStep,
    setClaimStatus,
    claimCallback,
    setClaimedAmount,
    handleSetError,
    claimInputData,
    setIsInvestFlowActive,
  ])

  // on account/activeAccount/non-connected account (if claiming for someone else) change
  useEffect(() => {
    if (!isSearchUsed && account) {
      setActiveClaimAccount(account)
    }

    // properly reset the user to the claims table and initial investment flow
    resetClaimUi()
    // Depending on chainId even though it's not used because we want to reset the state on network change
  }, [
    account,
    activeClaimAccount,
    chainId,
    resolvedAddress,
    isSearchUsed,
    setActiveClaimAccount,
    resetClaimUi,
    handleAccountChange,
  ])

  // handle account disconnect or account change after claim is confirmed
  useEffect(() => {
    if (!account || (account !== previousAccount && claimStatus === ClaimStatus.CONFIRMED)) {
      handleAccountChange(account || '')
    }
  }, [account, claimStatus, previousAccount, handleAccountChange])

  // Transaction confirmation modal
  const { TransactionConfirmationModal, openModal, closeModal } = useTransactionConfirmationModal(
    ConfirmOperationType.APPROVE_TOKEN
  )

  return (
    <PageWrapper>
      {/* State Updater */}
      <ClaimsOnOtherChainsUpdater />
      {/* Cross chain claim banner */}
      <ClaimsOnOtherChainsBanner />
      {/* Claiming content */}
      <InnerPageWrapper>
        {isClaimDataLoading ? (
          <Loader size="5rem" />
        ) : (
          <>
            {/* Approve confirmation modal */}
            <TransactionConfirmationModal />
            {/* Error modal */}
            <ErrorModal />
            {/* If claim is confirmed > trigger confetti effect */}
            <Confetti start={claimStatus === ClaimStatus.CONFIRMED} />
            {/* Top nav buttons */}
            <ClaimNav account={account} handleChangeAccount={handleChangeClick} />
            {/* Show banner that tells if user has available claims or has already claimed all */}
            <ClaimBanner isClaimed={isClaimed} hasClaims={hasClaims} />
            {/* Show total to claim (user has airdrop or airdrop+investment) */}
            <ClaimSummary hasClaims={hasClaims} unclaimedAmount={unclaimedAmount} isClaimed={isClaimed} />
            {/* Get address/ENS (user not connected yet or opted for checking 'another' account) */}
            <ClaimAddress account={account} toggleWalletModal={toggleWalletModal} />
            {/* Is Airdrop only (simple) - does user have claims? Show messages dependent on claim state */}
            <CanUserClaimMessage
              hasClaims={hasClaims}
              isClaimed={isClaimed}
              isAirdropOnly={isAirdropOnly}
              handleChangeAccount={handleChangeClick}
            />

            {/* Try claiming or inform successful claim */}
            <ClaimingStatus handleChangeAccount={handleChangeClick} />
            {/* IS Airdrop + investing (advanced) */}
            <ClaimsTable isAirdropOnly={isAirdropOnly} claims={userClaimData} hasClaims={hasClaims} />
            {/* Investing vCOW flow (advanced) */}
            <InvestmentFlow
              isAirdropOnly={isAirdropOnly}
              claims={userClaimData}
              hasClaims={hasClaims}
              modalCbs={{ openModal, closeModal }}
            />

            <FooterNavButtons
              handleCheckClaim={handleCheckClaim}
              handleSubmitClaim={handleSubmitClaim}
              toggleWalletModal={toggleWalletModal}
              isAirdropOnly={isAirdropOnly}
              isPaidClaimsOnly={isPaidClaimsOnly}
              hasClaims={hasClaims}
              isClaimed={isClaimed}
              resolvedAddress={resolvedAddress}
            />
          </>
        )}
      </InnerPageWrapper>
    </PageWrapper>
  )
}
