import { pathToFileURL } from 'node:url'
import {
  AssuranceBasis, F2Modification, Invariant,
  InvariantViolation, PlainJsReferenceAdapter,
} from '@supersemantics/vsl-core'

export const refundPolicy = new Invariant({
  name: 'refund-cap',
  description: 'Refunds require an integer amount from 0 to 1000 minor units.',
  assuranceBasis: new AssuranceBasis(true, F2Modification.NONE),
  rule: async input =>
    typeof input === 'object' && input !== null &&
    'amount' in input && typeof input.amount === 'number' &&
    Number.isSafeInteger(input.amount) &&
    input.amount >= 0 && input.amount <= 1000,
})

export const refundGate = new PlainJsReferenceAdapter().compileInvariant(refundPolicy)

export async function submitRefund(amount, issue) {
  await refundGate({ amount })
  await issue(amount)
}

export async function demoRefunds() {
  const issue = async amount => { console.log(`ISSUED ${amount}`) }
  await submitRefund(250, issue)
  try {
    await submitRefund(1200, issue)
  } catch (error) {
    if (!(error instanceof InvariantViolation)) throw error
    console.log(`DENIED: ${error.reason}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await demoRefunds()
}
