// import { Trans } from '@lingui/macro'
import // ARBITRUM_HELP_CENTER_LINK,
// CHAIN_INFO,
// L2_CHAIN_IDS,
// OPTIMISM_HELP_CENTER_LINK,
// SupportedL2ChainId,
// SupportedChainId
'@src/constants/chains'
import { supportedChainId } from 'utils/supportedChainId'
import { SupportedChainId, CHAIN_INFO, ALL_SUPPORTED_CHAIN_IDS } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { useActiveWeb3React } from 'hooks/web3'
import { useCallback, useRef, useEffect, useState, useMemo } from 'react'
import { /* ArrowDownCircle, */ ChevronDown } from 'react-feather'
import { useModalOpen, useToggleModal, useWalletModalToggle } from 'state/application/hooks'
import { ApplicationModal } from 'state/application/reducer'
import { useAppSelector } from 'state/hooks'
import styled from 'styled-components/macro'
import { /* ExternalLink, */ MEDIA_WIDTHS } from 'theme'
import { switchToNetwork } from 'utils/switchToNetwork'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'

// const ActiveRowLinkList = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 0 8px;
//   & > a {
//     align-items: center;
//     color: ${({ theme }) => theme.text2};
//     display: flex;
//     flex-direction: row;
//     font-size: 14px;
//     font-weight: 500;
//     justify-content: space-between;
//     padding: 8px 0 4px;
//     text-decoration: none;
//   }
//   & > a:first-child {
//     border-top: 1px solid ${({ theme }) => theme.text2};
//     margin: 0;
//     margin-top: 6px;
//     padding-top: 10px;
//   }
// `
// const ActiveRowWrapper = styled.div`
//   background-color: ${({ theme }) => theme.bg2};
//   border-radius: 8px;
//   cursor: pointer;
//   padding: 8px 0 8px 0;
//   width: 100%;
// `
// const FlyoutHeader = styled.div`
//   color: ${({ theme }) => theme.text1};
//   font-weight: 400;
// `
const FlyoutMenu = styled.div`
  align-items: flex-start;
  border: 1px solid ${({ theme }) => theme.bg0};
  background-color: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 16px;
  overflow: auto;
  padding: 0.3rem;
  position: absolute;
  top: 64px;
  min-width: 175px;
  z-index: 99;
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    top: 50px;
  }
`
const FlyoutRow = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${({ active, theme }) => (active ? theme.primary1 : 'transparent')};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
  text-align: left;
  width: 100%;
  color: ${({ active, theme }) => (active ? theme.text2 : theme.text1)};
  &:hover {
    color: ${({ theme, active }) => !active && theme.text1};
    background: ${({ theme, active }) => !active && theme.bg4};
  }
  transition: background 0.13s ease-in-out;
`
const FlyoutRowActiveIndicator = styled.div<{ active: boolean }>`
  background-color: ${({ active, theme }) => (active ? theme.green1 : '#a7a7a7')};
  border-radius: 50%;
  height: 9px;
  width: 9px;
`
// const LinkOutCircle = styled(ArrowDownCircle)`
//   transform: rotate(230deg);
//   width: 16px;
//   height: 16px;
// `
const Logo = styled.img`
  height: 20px;
  width: 16px;
  margin-right: 8px;
`
const NetworkLabel = styled.div`
  flex: 1 1 auto;
  margin: 0px auto 0px 8px;
`
const SelectorLabel = styled(NetworkLabel)`
  display: none;
  margin-left: 0;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    display: block;
    margin-right: 8px;
  }
`
const SelectorControls = styled.div<{ interactive: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.bg4};
  border: 1px solid ${({ theme }) => theme.bg0};
  border-radius: 12px;
  color: ${({ theme }) => theme.text1};
  cursor: ${({ interactive }) => (interactive ? 'pointer' : 'auto')};
  display: flex;
  font-weight: 500;
  justify-content: space-between;
  padding: 6px 8px;
`
const SelectorLogo = styled(Logo)<{ interactive?: boolean }>`
  margin-right: ${({ interactive }) => (interactive ? 8 : 0)}px;
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    margin-right: 8px;
  }
`
const SelectorWrapper = styled.div`
  @media screen and (min-width: ${MEDIA_WIDTHS.upToSmall}px) {
    position: relative;
  }
`
const StyledChevronDown = styled(ChevronDown)`
  width: 12px;
`
// const BridgeText = ({ chainId }: { chainId: SupportedL2ChainId }) => {
//   switch (chainId) {
//     case SupportedChainId.ARBITRUM_ONE:
//     case SupportedChainId.ARBITRUM_RINKEBY:
//       return <Trans>Arbitrum Bridge</Trans>
//     case SupportedChainId.OPTIMISM:
//     case SupportedChainId.OPTIMISTIC_KOVAN:
//       return <Trans>Optimism Gateway</Trans>
//     default:
//       return <Trans>Bridge</Trans>
//   }
// }
// const ExplorerText = ({ chainId }: { chainId: SupportedL2ChainId }) => {
//   switch (chainId) {
//     case SupportedChainId.ARBITRUM_ONE:
//     case SupportedChainId.ARBITRUM_RINKEBY:
//       return <Trans>Arbiscan</Trans>
//     case SupportedChainId.OPTIMISM:
//     case SupportedChainId.OPTIMISTIC_KOVAN:
//       return <Trans>Optimistic Etherscan</Trans>
//     default:
//       return <Trans>Explorer</Trans>
//   }
// }

export default function NetworkSelector() {
  const { chainId: preChainId, library, account } = useActiveWeb3React()
  const { error } = useWeb3React() // MOD: check unsupported network
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.NETWORK_SELECTOR)
  const toggle = useToggleModal(ApplicationModal.NETWORK_SELECTOR)
  const toggleWalletModal = useWalletModalToggle() // MOD
  useOnClickOutside(node, open ? toggle : undefined)
  const implements3085 = useAppSelector((state) => state.application.implements3085)

  // MOD: checks if a requested network switch was sent
  // used for when user disconnected and selects a network internally
  // if 3085 supported, will connect wallet and change network
  const [queuedNetworkSwitch, setQueuedNetworkSwitch] = useState<null | number>(null)

  // MOD: get supported chain and check unsupported
  const [chainId, isUnsupportedChain] = useMemo(() => {
    const chainId = supportedChainId(preChainId)

    return [chainId, error instanceof UnsupportedChainIdError] // Mod - return if chainId is unsupported
  }, [preChainId, error])

  const info = chainId ? CHAIN_INFO[chainId] : undefined

  // const isOnL2 = chainId ? L2_CHAIN_IDS.includes(chainId) : false
  // const showSelector = Boolean(!account || implements3085 || isOnL2)
  const showSelector = Boolean(!account || implements3085)
  const mainnetInfo = CHAIN_INFO[SupportedChainId.MAINNET]

  const conditionalToggle = useCallback(() => {
    if (showSelector) {
      toggle()
    }
  }, [showSelector, toggle])

  const networkCallback = useCallback(
    (supportedChainId) => {
      if (!account) {
        toggleWalletModal()
        return setQueuedNetworkSwitch(supportedChainId)
      } else if (implements3085 && library && supportedChainId) {
        switchToNetwork({ library, chainId: supportedChainId })
        return open && toggle()
      }

      return
    },
    [account, implements3085, library, open, toggle, toggleWalletModal]
  )

  // MOD: used with mod hook - used to connect disconnected wallet to selected network
  // if wallet supports 3085
  useEffect(() => {
    if (queuedNetworkSwitch && account && chainId && implements3085) {
      networkCallback(queuedNetworkSwitch)
      setQueuedNetworkSwitch(null)
    }
  }, [networkCallback, queuedNetworkSwitch, chainId, account, implements3085])

  if (!chainId || !info || !library || isUnsupportedChain) {
    return null
  }

  /* function Row({ targetChain }: { targetChain: number }) {
    if (!library || !chainId || (!implements3085 && targetChain !== chainId)) {
      return null
    }
    const handleRowClick = () => {
      switchToNetwork({ library, chainId: targetChain })
      toggle()
    }
    const active = chainId === targetChain
    const hasExtendedInfo = L2_CHAIN_IDS.includes(targetChain)
    const isOptimism = targetChain === SupportedChainId.OPTIMISM
    const rowText = `${CHAIN_INFO[targetChain].label}${isOptimism ? ' (Optimism)' : ''}`
    const rowText = CHAIN_INFO[targetChain].label // mod
    const RowContent = () => (
      <FlyoutRow onClick={handleRowClick} active={active}>
        <Logo src={CHAIN_INFO[targetChain].logoUrl} />
        <NetworkLabel>{rowText}</NetworkLabel>
        {chainId === targetChain && <FlyoutRowActiveIndicator />}
        <FlyoutRowActiveIndicator active={chainId === targetChain} />
      </FlyoutRow>
    )
    const helpCenterLink = isOptimism ? OPTIMISM_HELP_CENTER_LINK : ARBITRUM_HELP_CENTER_LINK
    if (active && hasExtendedInfo) {
      return (
        <ActiveRowWrapper>
          <RowContent />
          <ActiveRowLinkList>
            <ExternalLink href={CHAIN_INFO[targetChain as SupportedL2ChainId].bridge}>
              <BridgeText chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
            <ExternalLink href={CHAIN_INFO[targetChain].explorer}>
              <ExplorerText chainId={chainId} /> <LinkOutCircle />
            </ExternalLink>
            <ExternalLink href={helpCenterLink}>
              <Trans>Help Center</Trans> <LinkOutCircle />
            </ExternalLink>
          </ActiveRowLinkList>
        </ActiveRowWrapper>
      )
    }
    return <RowContent />
  } */

  return (
    <SelectorWrapper ref={node as any}>
      <SelectorControls onClick={conditionalToggle} interactive={showSelector}>
        <SelectorLogo interactive={showSelector} src={info.logoUrl || mainnetInfo.logoUrl} />
        <SelectorLabel>{info.label}</SelectorLabel>
        {showSelector && <StyledChevronDown />}
      </SelectorControls>
      {open && (
        <FlyoutMenu>
          {/* <FlyoutHeader>
            <Trans>Select a network</Trans>
          </FlyoutHeader>
          <Row targetChain={SupportedChainId.MAINNET} />
          <Row targetChain={SupportedChainId.RINKEBY} />
          <Row targetChain={SupportedChainId.XDAI} /> */}

          {ALL_SUPPORTED_CHAIN_IDS.map((targetChain) => {
            const active = !!account && chainId === targetChain
            const rowText = CHAIN_INFO[targetChain].label
            const callback = () => networkCallback(targetChain)

            return (
              <FlyoutRow key={targetChain} onClick={callback} active={active}>
                <Logo src={CHAIN_INFO[targetChain].logoUrl} />
                <NetworkLabel>{rowText}</NetworkLabel>
                <FlyoutRowActiveIndicator active={active} />
              </FlyoutRow>
            )
          })}
        </FlyoutMenu>
      )}
    </SelectorWrapper>
  )
}
