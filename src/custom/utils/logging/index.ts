import OperatorError from 'api/gnosisProtocol/errors/OperatorError'
import QuoteError from 'api/gnosisProtocol/errors/QuoteError'

type SentryErrorOptions = {
  message: string
  name: string
  optionalTags?: {
    [x: string]: string
  }
}

export function constructSentryError(
  baseError: QuoteError | OperatorError | Error,
  response: any,
  { message, name, optionalTags = {} }: SentryErrorOptions
) {
  const constructedError = Object.assign(new Error(), baseError, {
    message,
    name,
  })

  const tags = {
    ...optionalTags,
    errorType: baseError?.name,
    responseStatus: response.status,
  }

  return { baseError, sentryError: constructedError, tags }
}
