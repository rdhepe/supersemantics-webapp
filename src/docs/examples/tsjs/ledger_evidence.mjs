import { pathToFileURL } from 'node:url'
import { randomUUID } from 'node:crypto'
import {
  InvariantViolation, JsonlLedgerStore, VerbaLedger,
} from '@supersemantics/vsl-core'
import { refundGate, refundPolicy } from './first_gate.mjs'

export async function recordDeniedRefund(ledger, decisionId) {
  let allowed = true
  try {
    await refundGate({ amount: 1200 })
  } catch (error) {
    if (!(error instanceof InvariantViolation)) throw error
    allowed = false
    console.log(`DENIED: ${error.reason}`)
  }
  await ledger.writeGateDecision('refund-agent', refundPolicy.name, {
    allowed, decisionId,
  })
}

export async function demoLedger() {
  const ledger = new VerbaLedger(new JsonlLedgerStore('refund-ledger.jsonl'))
  await recordDeniedRefund(ledger, randomUUID())
  console.log(`Integrity: ${await ledger.verifyIntegrity()}`)
  const report = await ledger.audit()
  console.log(`Lifecycle complete: ${report.allPassed}`)
  console.log('Missing evidence:', report.checksFailed)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await demoLedger()
}
