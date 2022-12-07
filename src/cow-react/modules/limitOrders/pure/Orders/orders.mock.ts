import { Order, OrderStatus } from 'state/orders/actions'
import { COW, DAI, GNO, USDC } from 'constants/tokens'
import { OrderKind } from '@cowprotocol/contracts'
import { WETH_GOERLI } from 'utils/goerli/constants'

const chainId = 5
const owner = '0x4cc6e4f6014cc998fc5ef14c3f5d1184f76ae25b'

export const ordersMock: Order[] = [
  {
    id: '1',
    owner,
    summary: '',
    status: OrderStatus.PENDING,
    creationTime: '2022-11-11T13:15:13.551Z',
    inputToken: WETH_GOERLI,
    outputToken: GNO[chainId],
    receiver: '',
    sellToken: WETH_GOERLI.address,
    buyToken: GNO[chainId].address,
    sellAmount: '5000300000000000',
    buyAmount: '23000000000000',
    sellAmountBeforeFee: '5000300000000000',
    feeAmount: '0',
    validTo: Date.now() + 20000,
    appData: '',
    partiallyFillable: false,
    signature: '',
    class: 'market',
    kind: OrderKind.SELL,
  },
  {
    id: '2',
    owner,
    summary: '',
    status: OrderStatus.PENDING,
    creationTime: '2022-10-03T09:15:13.551Z',
    inputToken: COW[chainId],
    outputToken: GNO[chainId],
    receiver: '',
    sellToken: COW[chainId].address,
    buyToken: GNO[chainId].address,
    sellAmount: '1230000000000000',
    buyAmount: '55000000000000',
    sellAmountBeforeFee: '1230000000000000',
    feeAmount: '0',
    validTo: Date.now() + 50000,
    appData: '',
    partiallyFillable: false,
    signature: '',
    class: 'market',
    kind: OrderKind.SELL,
  },
  {
    id: '3',
    owner,
    summary: '',
    status: OrderStatus.EXPIRED,
    creationTime: '2022-11-11T13:15:13.551Z',
    inputToken: USDC[chainId],
    outputToken: DAI,
    receiver: '',
    sellToken: USDC[chainId].address,
    buyToken: DAI.address,
    sellAmount: '9800000000000000',
    buyAmount: '1000000000000',
    sellAmountBeforeFee: '9800000000000000',
    feeAmount: '0',
    validTo: Date.now() + 10000,
    appData: '',
    partiallyFillable: false,
    signature: '',
    class: 'market',
    kind: OrderKind.SELL,
  },
  {
    id: '4',
    owner,
    summary: '',
    status: OrderStatus.FULFILLED,
    creationTime: '2022-11-11T13:15:13.551Z',
    inputToken: USDC[chainId],
    outputToken: GNO[chainId],
    receiver: '',
    sellToken: USDC[chainId].address,
    buyToken: GNO[chainId].address,
    sellAmount: '5000300000000000',
    buyAmount: '23000000000000',
    sellAmountBeforeFee: '5000300000000000',
    feeAmount: '0',
    validTo: Date.now() + 20000,
    appData: '',
    partiallyFillable: false,
    signature: '',
    class: 'market',
    kind: OrderKind.SELL,
  },
  {
    id: '5',
    owner,
    summary: '',
    status: OrderStatus.FULFILLED,
    creationTime: '2022-09-09T13:15:13.551Z',
    inputToken: USDC[chainId],
    outputToken: DAI,
    receiver: '',
    sellToken: USDC[chainId].address,
    buyToken: DAI.address,
    sellAmount: '9800000000000000',
    buyAmount: '1000000000000',
    sellAmountBeforeFee: '9800000000000000',
    feeAmount: '0',
    validTo: Date.now() + 10000,
    appData: '',
    partiallyFillable: false,
    signature: '',
    class: 'market',
    kind: OrderKind.SELL,
  },
]
