import { InlineBanner } from 'common/pure/InlineBanner'

export function SmallPriceProtectionWarning() {
  return (
    <InlineBanner>
      <strong>Attention</strong>
      <p>
        Since prices can change significantly over time, we suggest increasing your price protection for orders with
        long deadlines.
      </p>
    </InlineBanner>
  )
}
