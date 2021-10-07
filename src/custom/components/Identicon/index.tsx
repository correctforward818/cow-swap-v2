import React from 'react'
import IdenticonMod, { StyledIdenticonContainer } from './IdenticonMod'
import styled from 'styled-components/macro'

const Wrapper = styled.div<{ size?: number }>`
  ${StyledIdenticonContainer} {
    height: ${({ size }) => (size ? `${size}px` : '1rem')};
    width: ${({ size }) => (size ? `${size}px` : '1rem')};
    border-radius: ${({ size }) => (size ? `${size}px` : '1rem')};
  }
`

export interface IdenticonProps {
  size?: number
}

export default function Identicon({ size }: IdenticonProps) {
  return (
    <Wrapper size={size}>
      <IdenticonMod size={size} />
    </Wrapper>
  )
}
