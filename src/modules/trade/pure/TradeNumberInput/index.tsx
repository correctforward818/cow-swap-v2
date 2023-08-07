import { useCallback, useEffect, useState } from 'react'

import BigNumberJs from 'bignumber.js'
import SVG from 'react-inlinesvg'

import carretDown from 'legacy/assets/cow-swap/carret-down.svg'

import { TradeWidgetField, TradeWidgetFieldProps } from 'modules/trade/pure/TradeWidgetField'

import { ArrowsWrapper, InputWrapper, NumericalInput, Suffix } from './styled'

export { NumericalInput } from './styled'

export interface TradeNumberInputProps extends TradeWidgetFieldProps {
  value: number | null

  onUserInput(input: number | null): void

  suffix?: string
  decimalsPlaces?: number
  min?: number
  max?: number
  step?: number
  placeholder?: string
  showUpDownArrows?: boolean
  upDownArrowsLeftAlign?: boolean
  prefixComponent?: React.ReactElement
}

type InputArrowsProps = {
  onClickUp: () => void
  onClickDown: () => void
}

export function InputArrows({ onClickUp, onClickDown }: InputArrowsProps) {
  return (
    <ArrowsWrapper>
      <span role="button" aria-label="Increase Value" aria-disabled="false" onClick={onClickUp}>
        <span role="img" aria-label="up">
          <SVG src={carretDown} />
        </span>
      </span>

      <span role="button" aria-label="Decrease Value" aria-disabled="false" onClick={onClickDown}>
        <span role="img" aria-label="down">
          <SVG src={carretDown} />
        </span>
      </span>
    </ArrowsWrapper>
  )
}

export function TradeNumberInput(props: TradeNumberInputProps) {
  const {
    value,
    suffix,
    onUserInput,
    placeholder = '0',
    decimalsPlaces = 0,
    min,
    max = 100_000,
    step = 1,
    prefixComponent,
    showUpDownArrows = false,
    upDownArrowsLeftAlign = false,
  } = props

  const [displayedValue, setDisplayedValue] = useState(value === null ? '' : value.toString())

  const validateInput = useCallback(
    (newValue: string) => {
      const hasDot = newValue.includes('.')
      const [quotient, decimals] = (newValue || '').split('.')
      const filteredDecimals = decimalsPlaces && hasDot ? `.${decimals.slice(0, decimalsPlaces)}` : ''
      const adjustedValue = quotient + filteredDecimals
      const parsedValue = adjustedValue ? parseFloat(adjustedValue) : null

      if (parsedValue && max !== undefined && parsedValue > max) {
        setDisplayedValue(max.toString())
        onUserInput(max)
        return
      }

      if (min !== undefined && (!parsedValue || parsedValue < min)) {
        setDisplayedValue(min.toString())
        onUserInput(min)
        return
      }

      setDisplayedValue(adjustedValue)

      if (value !== parsedValue) {
        onUserInput(parsedValue)
      }
    },
    [onUserInput, value, min, max, decimalsPlaces]
  )

  // Initial setup of value
  useEffect(() => {
    validateInput(value ? value.toString() : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickUp = useCallback(() => {
    validateInput(increaseValue(displayedValue, step, min))
  }, [displayedValue, min, step, validateInput])

  const onClickDown = useCallback(() => {
    validateInput(decreaseValue(displayedValue, step, min))
  }, [displayedValue, min, step, validateInput])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        onClickUp()
      } else if (e.key === 'ArrowDown') {
        onClickDown()
      }
    },
    [onClickDown, onClickUp]
  )

  return (
    <TradeWidgetField {...props} hasPrefix={!!prefixComponent}>
      <>
        {prefixComponent}
        <InputWrapper showUpDownArrows={showUpDownArrows} upDownArrowsLeftAlign={upDownArrowsLeftAlign}>
          <NumericalInput
            placeholder={placeholder}
            value={displayedValue}
            onBlur={(e) => validateInput(e.target.value)}
            onUserInput={(value) => setDisplayedValue(value)}
            onKeyDown={onKeyDown}
            min={min}
            max={max}
            step={step}
          />
          {showUpDownArrows && <InputArrows onClickUp={onClickUp} onClickDown={onClickDown} />}
          {suffix && <Suffix>{suffix}</Suffix>}
        </InputWrapper>
      </>
    </TradeWidgetField>
  )
}

/**
 * Increase `value` by `step`
 *
 * If no `value`, use `min`
 * If no `min`, use `step`
 *
 * Uses BigNumberJS for avoiding JS finicky float point math
 */
function increaseValue(value: string, step: number, min: number | undefined): string {
  const n = new BigNumberJs(value)

  if (!n.isNaN()) {
    return n.plus(step).toString()
  }

  return min?.toString() || step.toString()
}

/**
 * Decrease `value` by `step`
 *
 * If no `value`, use `min`
 * If no `min`, use `step`

 * Uses BigNumberJS for avoiding JS finicky float point math
 */
function decreaseValue(value: string, step: number, min: number | undefined) {
  const n = new BigNumberJs(value)

  if (!n.isNaN()) {
    return n.minus(step).toString()
  }

  return min?.toString() || step.toString()
}
