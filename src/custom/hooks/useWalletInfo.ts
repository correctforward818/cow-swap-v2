import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import useENSName from '@src/hooks/useENSName'
import { useEffect, useState } from 'react'
import { UNSUPPORTED_WC_WALLETS } from 'constants/index'
import { getConnection } from 'connection/utils'
import { getSafeInfo } from 'api/gnosisSafe'
import { SafeInfoResponse } from '@gnosis.pm/safe-service-client'
import useIsArgentWallet from 'hooks/useIsArgentWallet'
import { ConnectionType } from 'connection'

const GNOSIS_SAFE_APP_NAME = 'Gnosis Safe App'
const GNOSIS_SAFE_WALLET_NAMES = ['Gnosis Safe Multisig', 'Gnosis Safe', GNOSIS_SAFE_APP_NAME]
const SAFE_ICON_URL = 'https://apps.gnosis-safe.io/wallet-connect/favicon.ico'

export interface ConnectedWalletInfo {
  chainId?: number
  active?: boolean
  account?: string | null
  provider?: Web3Provider
  isSmartContractWallet: boolean
  walletName?: string
  ensName?: string
  icon?: string
  isSupportedWallet: boolean
  allowsOffchainSigning: boolean
  gnosisSafeInfo?: SafeInfoResponse
}

async function checkIsSmartContractWallet(
  address: string | undefined | null,
  web3: Web3Provider | undefined
): Promise<boolean> {
  if (!address || !web3) {
    return false
  }

  try {
    const code = await web3.getCode(address)
    return code !== '0x'
  } catch (e) {
    console.debug(`checkIsSmartContractWallet: failed to check address ${address}`, e.message)
    return false
  }
}

function checkIsSupportedWallet(params: {
  walletName?: string
  chainId?: number
  gnosisSafeInfo?: SafeInfoResponse
}): boolean {
  const { walletName } = params

  if (walletName && UNSUPPORTED_WC_WALLETS.has(walletName)) {
    // Unsupported wallet
    return false
  }

  return true
}

async function getWcPeerMetadata(
  provider: WalletConnectProvider | undefined
): Promise<{ walletName?: string; icon?: string }> {
  // fix for this https://github.com/gnosis/cowswap/issues/1929
  const defaultOutput = { walletName: undefined, icon: undefined }

  if (!provider) {
    return defaultOutput
  }

  const meta = provider.connector.peerMeta

  if (meta) {
    return {
      walletName: meta.name,
      icon: meta.icons?.length > 0 ? meta.icons[0] : undefined,
    }
  } else {
    return defaultOutput
  }
}

export function useWalletInfo(): ConnectedWalletInfo {
  const { account, connector, provider, chainId, isActive: active } = useWeb3React()
  const isArgentWallet = useIsArgentWallet()
  const [walletName, setWalletName] = useState<string>()
  const [icon, setIcon] = useState<string>()
  const [isSmartContractWallet, setIsSmartContractWallet] = useState(false)
  const { ENSName } = useENSName(account ?? undefined)
  const [gnosisSafeInfo, setGnosisSafeInfo] = useState<SafeInfoResponse>()

  const connectionType = getConnection(connector).type

  useEffect(() => {
    // Reset name and icon when provider changes
    // These values are only set for WC wallets
    // When connect is not WC, leave them empty
    setWalletName('')
    setIcon('')

    // If the connector is wallet connect, try to get the wallet name and icon
    switch (connectionType) {
      case ConnectionType.WALLET_CONNECT:
        const wc = provider?.provider
        if (wc instanceof WalletConnectProvider) {
          getWcPeerMetadata(wc).then(({ walletName, icon }) => {
            setWalletName(walletName)
            setIcon(icon)
          })
        }
        break
      case ConnectionType.GNOSIS_SAFE:
        setWalletName(GNOSIS_SAFE_APP_NAME)
        setIcon(SAFE_ICON_URL)
        break
    }
  }, [connectionType, connector, provider])
  useEffect(() => {
    if (account && isArgentWallet) {
      setIsSmartContractWallet(true)
    } else if (account && provider) {
      checkIsSmartContractWallet(account, provider).then(setIsSmartContractWallet)
    }
  }, [account, chainId, isArgentWallet, provider])

  useEffect(() => {
    const isGnosisSafe = walletName && GNOSIS_SAFE_WALLET_NAMES.includes(walletName)

    if (chainId && account && isGnosisSafe) {
      getSafeInfo(chainId, account)
        .then(setGnosisSafeInfo)
        .catch((error) => {
          console.error('[api/gnosisSafe] Error fetching GnosisSafe info', error)
        })
    } else {
      setGnosisSafeInfo(undefined)
    }
  }, [chainId, account, walletName])

  return {
    chainId,
    active,
    account,
    provider,
    isSmartContractWallet,
    walletName,
    icon,
    ensName: ENSName || undefined,
    isSupportedWallet: checkIsSupportedWallet({ walletName, chainId, gnosisSafeInfo }),

    // TODO: For now, all SC wallets use pre-sign instead of offchain signing
    // In the future, once the API adds EIP-1271 support, we can allow some SC wallets to use offchain signing
    allowsOffchainSigning: !isSmartContractWallet,
    gnosisSafeInfo,
  }
}

export function useIsGnosisSafeApp(): boolean {
  const { walletName } = useWalletInfo()

  return walletName === GNOSIS_SAFE_APP_NAME
}
