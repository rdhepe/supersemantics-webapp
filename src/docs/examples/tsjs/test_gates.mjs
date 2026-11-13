import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  AutomationDeniedException, GammaEstimate, InvariantViolation,
  JsonlLedgerStore, PlainJsReferenceAdapter, VerbaLedger, runConformanceSuite,
} from '@supersemantics/vsl-core'
import * as typescript from './dist/first_gate.js'
import * as javascript from './first_gate.mjs'
import { budgetGate } from './dist/threshold_gate.js'
import { recordDeniedRefund } from './dist/ledger_evidence.js'
import { budgetGate as javascriptBudgetGate } from './threshold_gate.mjs'
import { recordDeniedRefund as javascriptRecordDeniedRefund } from './ledger_evidence.mjs'

for (const [language, { refundGate, submitRefund }] of Object.entries({ typescript, javascript })) {
  test(`${language}: allows valid refunds at both boundaries`, async () => {
    const issued = []
    for (const amount of [0, 250, 1000]) {
      await submitRefund(amount, async value => { issued.push(value) })
    }
    assert.deepEqual(issued, [0, 250, 1000])
  })

  test(`${language}: denial happens before any side effect`, async () => {
    let calls = 0
    await assert.rejects(
      submitRefund(1001, async () => { calls += 1 }),
      InvariantViolation,
    )
    assert.equal(calls, 0)
  })

  test(`${language}: rejects malformed candidates`, async () => {
    for (const input of [null, {}, { amount: '250' }, { amount: -1 },
      { amount: 1.5 }, { amount: NaN }, { amount: Infinity }]) {
      await assert.rejects(refundGate(input), InvariantViolation)
    }
  })

  test(`${language}: application failures are not swallowed`, async () => {
    const failure = new Error('Payment provider unavailable')
    await assert.rejects(submitRefund(250, async () => { throw failure }), error => error === failure)
  })
}

test('Gamma is strict and does not double-count the estimation allowance', () => {
  assert.equal(new GammaEstimate({ gammaHat: 1.1 }).sufficient(), false)
  assert.equal(new GammaEstimate({ gammaHat: 1.11, deltaEstimationError: 0.1 }).sufficient(), true)
  const uncertain = new GammaEstimate({ gammaHat: 1.2, deltaEstimationError: 0.2 })
  assert.equal(uncertain.requiredGammaHat(1.1), 1.2)
  assert.equal(uncertain.sufficient(1.1), false)
})

for (const [language, gate] of Object.entries({ typescript: budgetGate, javascript: javascriptBudgetGate })) {
  test(`${language}: budget monitor blocks invalid and insufficient inputs`, async () => {
    await gate({ amount: 800 })
    for (const input of [null, {}, { amount: 0 }, { amount: NaN }, { amount: 1000 }]) {
      await assert.rejects(gate(input), AutomationDeniedException)
    }
  })
}

test('reference adapter passes the asynchronous conformance suite', async () => {
  assert.deepEqual(await runConformanceSuite(new PlainJsReferenceAdapter()), [])
})

for (const [language, record] of Object.entries({
  typescript: recordDeniedRefund, javascript: javascriptRecordDeniedRefund,
})) {
  test(`${language}: an intact denied-decision chain is not a complete lifecycle audit`, async () => {
    const ledger = new VerbaLedger()
    await record(ledger, 'denied-refund')
    assert.equal(await ledger.verifyIntegrity(), true)
    const report = await ledger.audit()
    assert.equal(report.allPassed, false)
    assert.ok(report.checksFailed.includes('drift_flagged_monitor_has_pre_node'))
  })
}

test('JSONL evidence survives opening a fresh store instance', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'vsl-docs-'))
  try {
    const file = join(directory, 'evidence.jsonl')
    await recordDeniedRefund(new VerbaLedger(new JsonlLedgerStore(file)), 'persisted-refund')
    const reopened = new VerbaLedger(new JsonlLedgerStore(file))
    assert.equal(await reopened.verifyIntegrity(), true)
    assert.equal((await reopened.audit()).allPassed, false)
    const entries = []
    for await (const entry of reopened.store.allEntries()) entries.push(entry)
    assert.equal(entries.length, 1)
    assert.equal(entries[0].decisionId, 'persisted-refund')
  } finally {
    await rm(directory, { recursive: true })
  }
})
