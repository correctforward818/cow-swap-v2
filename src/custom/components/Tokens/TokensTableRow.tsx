import { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, MaxUint256, Token } from '@uniswap/sdk-core'
import useTheme from 'hooks/useTheme'
import {
  ApproveLabel,
  BalanceValue,
  Cell,
  CustomLimit,
  IndexNumber,
  Label,
  ResponsiveGrid,
  ResponsiveLogo,
  TableButton,
  TokenText,
} from './styled'
import FavouriteTokenButton from './FavouriteTokenButton'
import { formatMax, formatSmart } from 'utils/format'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { OperationType } from 'components/TransactionConfirmationModal'
import { useErrorModal } from 'hooks/useErrorMessageAndModal'
import { CardsSpinner, ExtLink } from '@cow/pages/Account/styled'
import usePrevious from 'hooks/usePrevious'
import { useTokenAllowance } from 'hooks/useTokenAllowance'
import { useWeb3React } from '@web3-react/core'
import { AMOUNT_PRECISION, GP_VAULT_RELAYER } from 'constants/index'
import { OrderKind } from '@cowprotocol/contracts'
import BalanceCell from './BalanceCell'
import FiatBalanceCell from './FiatBalanceCell'
import Loader from 'components/Loader'
import { getBlockExplorerUrl } from 'utils'
import { SupportedChainId as ChainId } from 'constants/chains'
import { Link } from 'react-router-dom'
import { parameterizeTradeRoute } from '@cow/modules/trade/utils/parameterizeTradeRoute'
import { Routes } from '@cow/constants/routes'

type DataRowParams = {
  tokenData: Token
  index: number
  balance?: CurrencyAmount<Token> | undefined
  closeModals: () => void
  openTransactionConfirmationModal: (message: string, operationType: OperationType) => void
  toggleWalletModal: () => void
}

const DataRow = ({
  tokenData,
  index,
  balance,
  closeModals,
  openTransactionConfirmationModal,
  toggleWalletModal,
}: DataRowParams) => {
  const { account, chainId = ChainId.MAINNET } = useWeb3React()

  const theme = useTheme()
  const tradeLink = useCallback(
    (token: Token, kind: OrderKind) => {
      const inputCurrencyId = kind === OrderKind.SELL ? token.symbol : undefined
      const outputCurrencyId = kind === OrderKind.BUY ? token.symbol : undefined

      return parameterizeTradeRoute({ chainId: chainId.toString(), inputCurrencyId, outputCurrencyId }, Routes.SWAP)
    },
    [chainId]
  )

  // allowance
  const spender = chainId ? GP_VAULT_RELAYER[chainId] : undefined
  const currentAllowance = useTokenAllowance(tokenData, account ?? undefined, spender)

  // approve
  const [approving, setApproving] = useState(false)

  const { handleSetError, handleCloseError } = useErrorModal()

  const vaultRelayer = chainId ? GP_VAULT_RELAYER[chainId] : undefined
  const amountToApprove = CurrencyAmount.fromRawAmount(tokenData, MaxUint256)
  const amountToCheckAgainstAllowance = currentAllowance?.equalTo(0) ? undefined : balance

  const { approvalState, approve } = useApproveCallback({
    openTransactionConfirmationModal,
    closeModals,
    spender: vaultRelayer,
    amountToApprove,
    amountToCheckAgainstAllowance,
  })

  const prevApprovalState = usePrevious(approvalState)

  const handleApprove = useCallback(async () => {
    handleCloseError()

    if (!account) {
      toggleWalletModal()
      return
    }

    // TODO: make a separate hook out of this and add GA
    try {
      setApproving(true)
      const summary = `Approve ${tokenData?.symbol || 'token'}`
      await approve({ modalMessage: summary, transactionSummary: summary })
    } catch (error) {
      console.error(`[TokensTableRow]: Issue approving.`, error)
      handleSetError(error?.message)
    } finally {
      setApproving(false)
    }
  }, [account, approve, handleCloseError, handleSetError, toggleWalletModal, tokenData?.symbol])

  const isApproved = approvalState === ApprovalState.APPROVED
  const isPendingOnchainApprove = approvalState === ApprovalState.PENDING
  const isPendingApprove = !isApproved && (approving || isPendingOnchainApprove)

  const hasZeroBalance = !balance || balance?.equalTo(0)
  const hasNoAllowance = !currentAllowance || currentAllowance.equalTo(0)

  // This is so we only create fiat value request if there is a balance
  const fiatValue = useMemo(() => {
    if (!balance && account) {
      return <Loader />
    } else if (hasZeroBalance) {
      return <BalanceValue hasBalance={false}>0</BalanceValue>
    } else {
      return <FiatBalanceCell balance={balance} />
    }
  }, [account, balance, hasZeroBalance])

  const displayApproveContent = useMemo(() => {
    if (isPendingApprove) {
      return <CardsSpinner />
    } else if (!isApproved && !hasNoAllowance) {
      return (
        <CustomLimit>
          <TableButton onClick={handleApprove} color={theme.text1}>
            Approve all
          </TableButton>
          <ApproveLabel
            color={theme.green1}
            title={`Approved: ${formatMax(currentAllowance, currentAllowance.currency.decimals)}`}
          >
            Approved: <strong>{formatSmart(currentAllowance, AMOUNT_PRECISION)}</strong>
          </ApproveLabel>
        </CustomLimit>
      )
    } else if (!isApproved || hasNoAllowance) {
      return (
        <TableButton onClick={handleApprove} color={theme.text1}>
          Approve
        </TableButton>
      )
    } else {
      return <ApproveLabel color={theme.green1}>Approved ✓</ApproveLabel>
    }
  }, [currentAllowance, handleApprove, isApproved, isPendingApprove, hasNoAllowance, theme.green1, theme.text1])

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApproving(true)
    } else if (prevApprovalState === ApprovalState.PENDING && approvalState === ApprovalState.NOT_APPROVED) {
      setApproving(false)
    }
  }, [approvalState, prevApprovalState, approving])

  return (
    <ResponsiveGrid>
      <Cell>
        <FavouriteTokenButton tokenData={tokenData} />
        <IndexNumber>{index + 1}</IndexNumber>
      </Cell>

      <Cell>
        <ExtLink title={tokenData.name} href={getBlockExplorerUrl(chainId, tokenData.address, 'token')}>
          <ResponsiveLogo currency={tokenData} />
          <TokenText>
            <Label>
              <span>
                <b>{tokenData.name}</b>
                <i>{tokenData.symbol}</i>
              </span>
            </Label>
          </TokenText>
        </ExtLink>
      </Cell>

      <Cell>
        <BalanceCell balance={balance} />
      </Cell>

      <Cell>{fiatValue}</Cell>

      <Cell>
        <Link to={tradeLink(tokenData, OrderKind.BUY)}>
          <TableButton color={theme.green1}>Buy</TableButton>
        </Link>
      </Cell>

      <Cell>
        <Link to={tradeLink(tokenData, OrderKind.SELL)}>
          <TableButton color={theme.red1}>Sell</TableButton>
        </Link>
      </Cell>

      <Cell>{displayApproveContent}</Cell>
    </ResponsiveGrid>
  )
}

export default DataRow
