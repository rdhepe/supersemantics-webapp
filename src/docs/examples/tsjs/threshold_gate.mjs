import { pathToFileURL } from 'node:url'
import {
  AssuranceBasis, F2Modification, GammaEstimate,
  PlainJsReferenceAdapter, PreNode,
} from '@supersemantics/vsl-core'

export const budgetPolicy = new PreNode({
  name: 'budget-headroom',
  description: 'Require headroom above the robust Gamma threshold.',
  assuranceBasis: new AssuranceBasis(true, F2Modification.NONE),
  gammaThreshold: 1.1,
  monitor: async input => {
    const amount = typeof input === 'object' && input !== null &&
      'amount' in input ? input.amount : undefined
    const valid = typeof amount === 'number' &&
      Number.isSafeInteger(amount) && amount > 0
    return new GammaEstimate({
      gammaHat: valid ? 1000 / amount : 0,
      deltaEstimationError: 0.1,
    })
  },
})

export const budgetGate = new PlainJsReferenceAdapter().compilePreNode(budgetPolicy)

export async function demoThreshold() {
  await budgetGate({ amount: 800 })
  console.log('ALLOWED: 1000 / 800 = 1.25 > 1.1')
  const boundary = new GammaEstimate({ gammaHat: 1.1, deltaEstimationError: 0.1 })
  console.log(`Exact threshold passes: ${boundary.sufficient(1.1)}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await demoThreshold()
}
