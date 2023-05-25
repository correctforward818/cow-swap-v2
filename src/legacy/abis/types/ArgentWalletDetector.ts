/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export interface ArgentWalletDetectorInterface extends utils.Interface {
  functions: {
    "acceptedCodes(bytes32)": FunctionFragment;
    "acceptedImplementations(address)": FunctionFragment;
    "addCode(bytes32)": FunctionFragment;
    "addCodeAndImplementationFromWallet(address)": FunctionFragment;
    "addImplementation(address)": FunctionFragment;
    "changeOwner(address)": FunctionFragment;
    "getCodes()": FunctionFragment;
    "getImplementations()": FunctionFragment;
    "isArgentWallet(address)": FunctionFragment;
    "owner()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "acceptedCodes"
      | "acceptedImplementations"
      | "addCode"
      | "addCodeAndImplementationFromWallet"
      | "addImplementation"
      | "changeOwner"
      | "getCodes"
      | "getImplementations"
      | "isArgentWallet"
      | "owner"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "acceptedCodes",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "acceptedImplementations",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addCode",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "addCodeAndImplementationFromWallet",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addImplementation",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "changeOwner",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getCodes", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getImplementations",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isArgentWallet",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "acceptedCodes",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptedImplementations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addCode", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addCodeAndImplementationFromWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addImplementation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getCodes", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getImplementations",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isArgentWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;

  events: {
    "CodeAdded(bytes32)": EventFragment;
    "ImplementationAdded(address)": EventFragment;
    "OwnerChanged(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "CodeAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ImplementationAdded"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnerChanged"): EventFragment;
}

export interface CodeAddedEventObject {
  code: string;
}
export type CodeAddedEvent = TypedEvent<[string], CodeAddedEventObject>;

export type CodeAddedEventFilter = TypedEventFilter<CodeAddedEvent>;

export interface ImplementationAddedEventObject {
  implementation: string;
}
export type ImplementationAddedEvent = TypedEvent<
  [string],
  ImplementationAddedEventObject
>;

export type ImplementationAddedEventFilter =
  TypedEventFilter<ImplementationAddedEvent>;

export interface OwnerChangedEventObject {
  _newOwner: string;
}
export type OwnerChangedEvent = TypedEvent<[string], OwnerChangedEventObject>;

export type OwnerChangedEventFilter = TypedEventFilter<OwnerChangedEvent>;

export interface ArgentWalletDetector extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ArgentWalletDetectorInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    acceptedCodes(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

    acceptedImplementations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

    addCode(
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addCodeAndImplementationFromWallet(
      _argentWallet: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addImplementation(
      _impl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getCodes(overrides?: CallOverrides): Promise<[string[]]>;

    getImplementations(overrides?: CallOverrides): Promise<[string[]]>;

    isArgentWallet(
      _wallet: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    owner(overrides?: CallOverrides): Promise<[string]>;
  };

  acceptedCodes(
    arg0: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

  acceptedImplementations(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

  addCode(
    _code: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addCodeAndImplementationFromWallet(
    _argentWallet: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addImplementation(
    _impl: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  changeOwner(
    _newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getCodes(overrides?: CallOverrides): Promise<string[]>;

  getImplementations(overrides?: CallOverrides): Promise<string[]>;

  isArgentWallet(
    _wallet: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    acceptedCodes(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

    acceptedImplementations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[boolean, BigNumber] & { exists: boolean; index: BigNumber }>;

    addCode(
      _code: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    addCodeAndImplementationFromWallet(
      _argentWallet: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addImplementation(
      _impl: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getCodes(overrides?: CallOverrides): Promise<string[]>;

    getImplementations(overrides?: CallOverrides): Promise<string[]>;

    isArgentWallet(
      _wallet: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "CodeAdded(bytes32)"(
      code?: PromiseOrValue<BytesLike> | null
    ): CodeAddedEventFilter;
    CodeAdded(code?: PromiseOrValue<BytesLike> | null): CodeAddedEventFilter;

    "ImplementationAdded(address)"(
      implementation?: PromiseOrValue<string> | null
    ): ImplementationAddedEventFilter;
    ImplementationAdded(
      implementation?: PromiseOrValue<string> | null
    ): ImplementationAddedEventFilter;

    "OwnerChanged(address)"(
      _newOwner?: PromiseOrValue<string> | null
    ): OwnerChangedEventFilter;
    OwnerChanged(
      _newOwner?: PromiseOrValue<string> | null
    ): OwnerChangedEventFilter;
  };

  estimateGas: {
    acceptedCodes(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    acceptedImplementations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    addCode(
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addCodeAndImplementationFromWallet(
      _argentWallet: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addImplementation(
      _impl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getCodes(overrides?: CallOverrides): Promise<BigNumber>;

    getImplementations(overrides?: CallOverrides): Promise<BigNumber>;

    isArgentWallet(
      _wallet: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    acceptedCodes(
      arg0: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    acceptedImplementations(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addCode(
      _code: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addCodeAndImplementationFromWallet(
      _argentWallet: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addImplementation(
      _impl: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    changeOwner(
      _newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getCodes(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getImplementations(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isArgentWallet(
      _wallet: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
