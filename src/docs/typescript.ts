import firstGateTs from './examples/tsjs/first_gate.ts?raw'
import firstGateJs from './examples/tsjs/first_gate.mjs?raw'
import thresholdTs from './examples/tsjs/threshold_gate.ts?raw'
import thresholdJs from './examples/tsjs/threshold_gate.mjs?raw'
import ledgerTs from './examples/tsjs/ledger_evidence.ts?raw'
import ledgerJs from './examples/tsjs/ledger_evidence.mjs?raw'
import gateTests from './examples/tsjs/test_gates.mjs?raw'
import { docHref } from './content'
import type { CodeSample, DocPage } from './content'

const core = 'https://github.com/supersemantics/VSL-Corejs'
const source = `${core}/blob/master/src`
const adapter = 'https://github.com/supersemantics/VSL-Langgraphjs'
const href = (slug: string) => docHref(slug, 'typescript')
const firstGateSamples: CodeSample[] = [
  { label: 'first_gate.ts', language: 'typescript', code: firstGateTs, download: new URL('./examples/tsjs/first_gate.ts', import.meta.url).href },
  { label: 'first_gate.mjs', language: 'javascript', code: firstGateJs, download: new URL('./examples/tsjs/first_gate.mjs', import.meta.url).href },
]
const thresholdSamples: CodeSample[] = [
  { label: 'threshold_gate.ts', language: 'typescript', code: thresholdTs, download: new URL('./examples/tsjs/threshold_gate.ts', import.meta.url).href },
  { label: 'threshold_gate.mjs', language: 'javascript', code: thresholdJs, download: new URL('./examples/tsjs/threshold_gate.mjs', import.meta.url).href },
]
const ledgerSamples: CodeSample[] = [
  { label: 'ledger_evidence.ts', language: 'typescript', code: ledgerTs, download: new URL('./examples/tsjs/ledger_evidence.ts', import.meta.url).href },
  { label: 'ledger_evidence.mjs', language: 'javascript', code: ledgerJs, download: new URL('./examples/tsjs/ledger_evidence.mjs', import.meta.url).href },
]

export const typescriptPages: DocPage[] = [
  {
    slug: 'introduction', title: 'Govern before you execute.',
    description: 'Build your first pre-action boundary with VSL-Corejs. Learn the same governance primitives in TypeScript or plain JavaScript, without a Python runtime.',
    group: 'Get started', eyebrow: 'TYPESCRIPT & JAVASCRIPT / START HERE',
    sections: [
      { id: 'what-you-will-build', title: 'One action. One explicit boundary.', blocks: [
        { type: 'paragraph', text: 'Start with a capped refund. Define the rule, compile an asynchronous gate, and await it immediately before the side effect. Then add measurable headroom, decision evidence, and tests that prove a denied action never executes. No model API key or agent framework is needed for these lessons.' },
        { type: 'callout', tone: 'note', title: 'Node.js, not a browser SDK', text: 'VSL-Corejs uses Node built-ins, including filesystem and cryptography APIs. Run gates on the trusted server or worker that owns the action. This website displays code; it does not execute governance in your browser.' },
        { type: 'table', headers: ['Layer', 'What it owns'], rows: [
          ['@supersemantics/vsl-core', 'Invariant, PreNode, GammaEstimate, evidence stores, and adapter conformance.'],
          ['@supersemantics/vsl-langgraph', 'LangGraphAdapter, gatedNode, and routeOnDenial wiring.'],
          ['Your application', 'Input validation, side effects, identity, durable logging, retry policy, and recovery.'],
        ] },
      ] },
      { id: 'learning-path', title: 'Follow the learning path', blocks: [
        { type: 'links', items: [
          { title: '01 / Set up Node.js', description: 'Install the source package and choose TS or plain JS.', href: href('installation') },
          { title: '02 / Your first gate', description: 'Protect a refund with an awaited Invariant.', href: href('first-gate') },
          { title: '03 / Rules & thresholds', description: 'Use a PreNode and understand strict Gamma boundaries.', href: href('thresholds') },
          { title: '04 / Evidence & ledger', description: 'Record actual decisions and distinguish integrity from audit.', href: href('ledger') },
          { title: '05 / Test the boundary', description: 'Run Node tests against both language variants.', href: href('testing') },
          { title: '06 / Wire LangGraph.js', description: 'Place the gate before a node and route a denial.', href: href('integrations') },
        ] },
      ] }
    ],
    sources: [{ title: 'VSL-Corejs README', href: `${core}#readme` }, { title: 'Package and Node requirements', href: `${core}/blob/master/package.json` }, { title: 'Python canonical reference', href: 'https://github.com/supersemantics/VSL-Core' }],
  },
  {
    slug: 'installation', title: 'Set up your environment.',
    description: 'Use Node.js 22 LTS, ESM imports, and an isolated tutorial project. JavaScript runs directly; TypeScript compiles before execution.',
    group: 'Get started', eyebrow: 'STEP 01 / INSTALLATION',
    sections: [
      { id: 'requirements', title: 'Before you begin', blocks: [
        { type: 'list', items: ['Use Node.js 22 LTS and npm. The upstream package declares Node >=18, but these tutorial commands target Node 22.', 'Install Git if using the GitHub source-install path below.', 'Use your organization’s approved package sources. If public npm is blocked, request approved dependencies from your IT team; do not disable security controls or switch registries to bypass them.', 'Create a separate project. Do not install the runtime into this documentation website just to read the guides.'] },
      ] },
      { id: 'install-core', title: 'Install from the upstream source', blocks: [
        { type: 'paragraph', text: 'The upstream README names @supersemantics/vsl-core, but registry publication could not be independently checked here. This source-install path builds the GitHub package through its prepare script and may need registry-hosted build tools. It is not an offline workaround for restricted package access.' },
        { type: 'code', sample: { label: 'Terminal / PowerShell', language: 'bash', code: 'mkdir vsl-node-guide\ncd vsl-node-guide\nnpm init -y\nnpm pkg set type=module\nnpm install github:supersemantics/VSL-Corejs#master\nnpm ls @supersemantics/vsl-core' } },
        { type: 'callout', tone: 'tip', title: 'Pin what you validate', text: 'master is convenient for exploration, not reproducible production deployment. Replace it with a reviewed commit SHA, commit your lockfile, and rerun your gate and conformance tests when updating. For an approved prebuilt distribution, use the exact version provided by your package administrator.' },
      ] },
      { id: 'choose-language', title: 'Choose your execution path', blocks: [
        { type: 'paragraph', text: 'Plain JavaScript uses .mjs files and requires no compiler. Download first_gate.mjs from the next guide and run node first_gate.mjs. For TypeScript, install the compiler and Node types, then save the following configuration at your project root.' },
        { type: 'code', sample: { label: 'TypeScript tooling', language: 'bash', code: 'npm install --save-dev typescript @types/node' } },
        { type: 'code', sample: { label: 'tsconfig.json', language: 'json', code: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "NodeNext",\n    "moduleResolution": "NodeNext",\n    "strict": true,\n    "types": ["node"],\n    "rootDir": ".",\n    "outDir": "dist"\n  },\n  "include": ["*.ts"]\n}' } },
        { type: 'code', sample: { label: 'Compile, then run', language: 'bash', code: 'npx tsc\nnode dist/first_gate.js' } },
        { type: 'paragraph', text: 'Download the .ts examples into the project root, alongside tsconfig.json and package.json. Their relative imports deliberately end in .js so the compiled ESM files resolve in Node. Do not change those imports to .ts or run uncompiled files with older Node versions.' },
      ] },
    ],
    sources: [{ title: 'Core package manifest and prepare script', href: `${core}/blob/master/package.json` }, { title: 'Public exports', href: `${source}/index.ts` }, { title: 'Upstream compiler configuration', href: `${core}/blob/master/tsconfig.json` }],
  },
  {
    slug: 'first-gate', title: 'Your first gate.',
    description: 'Define a hard refund limit and prove the check completes before the action. Switch tabs for equivalent TypeScript and JavaScript implementations.',
    group: 'Get started', eyebrow: 'STEP 02 / FIRST GATE',
    sections: [
      { id: 'define-and-run', title: 'Define → compile → await → execute', blocks: [
        { type: 'paragraph', text: 'An Invariant is a rule that must hold. Its async rule receives unknown input and returns a boolean. This example accepts integer amounts from 0 to 1000 minor units, rejects malformed values, and places the compiled gate immediately before the refund callback.' },
        { type: 'code-group', samples: firstGateSamples },
        { type: 'code-group', samples: [
          { label: 'Run TypeScript', language: 'bash', code: 'npx tsc\nnode dist/first_gate.js' },
          { label: 'Run JavaScript', language: 'bash', code: 'node first_gate.mjs' },
        ] },
        { type: 'code', sample: { label: 'Expected behavior', language: 'text', code: "ISSUED 250\nDENIED: Invariant 'refund-cap' violated" } },
      ] },
      { id: 'read-the-contract', title: 'Understand the gate contract', blocks: [
        { type: 'list', items: ['compileInvariant returns an async function. Awaiting a successful gate resolves with no decision object; denial throws InvariantViolation.', 'InvariantViolation extends AutomationDeniedException. Catch only the denial you intend to handle and rethrow unexpected failures.', 'The callback stands in for a real refund API. Only the allowed amount reaches it; denied requests must never fall through to the action.', 'PlainJsReferenceAdapter is the minimal teaching adapter. Its exception identity is the fixed value conformance-test, not your production agent identity.', 'An Invariant’s terminal-state name does not implement application shutdown or recovery for you. Map violations into an explicit terminal workflow before production use.'] },
        { type: 'callout', tone: 'warning', title: 'LOW does not mean “does not block”', text: 'This example declares F1 pre-commitment=true and F2Modification.NONE, so its derived assurance level is LOW. It enforces the refund boundary but does not modify a model’s energy function. Assurance is self-declared; do not label a simple amount cap HIGH.' },
      ] },
    ],
    sources: [{ title: 'Invariant and rule types', href: `${source}/constructs.ts` }, { title: 'Reference adapter behavior', href: `${source}/conformance/reference_adapter.ts` }, { title: 'Typed denial errors', href: `${source}/exceptions.ts` }],
  },
  {
    slug: 'thresholds', title: 'Rules, ratios & thresholds.',
    description: 'Use an Invariant for a hard constraint. Use a PreNode when a monitor supplies a defensible estimate and uncertainty allowance.',
    group: 'Build & verify', eyebrow: 'STEP 03 / ROBUST GAMMA',
    sections: [
      { id: 'strict-boundary', title: 'Equality is not sufficient', blocks: [
        { type: 'paragraph', text: 'GammaEstimate.sufficient(threshold) requires gammaHat > max(threshold, 1 + deltaEstimationError). The default threshold is 1.1 and already includes a 10% estimation-error allowance. Only a larger declared uncertainty raises that bar again.' },
        { type: 'table', headers: ['gammaHat', 'Error allowance', 'Threshold', 'Outcome'], rows: [
          ['1.10', '0.10', '1.10', 'Denied: equality does not pass.'],
          ['1.11', '0.10', '1.10', 'Allowed: strictly above 1.10.'],
          ['1.20', '0.20', '1.10', 'Denied: required Gamma is 1.20.'],
          ['1.25', '0.20', '1.10', 'Allowed: strictly above 1.20.'],
        ] },
      ] },
      { id: 'build-a-monitor', title: 'Return a meaningful ratio', blocks: [
        { type: 'paragraph', text: 'Here the score is available budget / requested amount, with 1.0 meaning break-even. It is a transparent policy proxy, not a measurement of a model’s governance strength. Missing, non-integer, zero, or non-finite amounts produce a denying estimate; do not invent a passing score for unreadable input.' },
        { type: 'code-group', samples: thresholdSamples },
        { type: 'code-group', samples: [
          { label: 'Run TypeScript', language: 'bash', code: 'npx tsc\nnode dist/threshold_gate.js' },
          { label: 'Run JavaScript', language: 'bash', code: 'node threshold_gate.mjs' },
        ] },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: 'ALLOWED: 1000 / 800 = 1.25 > 1.1\nExact threshold passes: false' } },
        { type: 'callout', tone: 'warning', title: 'Do not confuse scores', text: 'A raw confidence in [0, 1] cannot exceed the default runtime Gamma threshold. A fixed 2-or-0 monitor is a pass/fail encoding, not measured Gamma. Static scanner scores are also a different quantity. For a non-negotiable business limit, keep the Invariant from the previous guide.' },
      ] },
    ],
    sources: [{ title: 'Gamma sufficiency and error allowance', href: `${source}/metrics.ts` }, { title: 'PreNode monitor contract', href: `${source}/constructs.ts` }, { title: 'Assurance rules version', href: `${source}/rules_version.ts` }],
  },
  {
    slug: 'ledger', title: 'Leave evidence, not assumptions.',
    description: 'Record the decision the gate actually made. Await ledger writes and distinguish an intact hash chain from a complete governance lifecycle.',
    group: 'Build & verify', eyebrow: 'STEP 04 / EVIDENCE & LEDGER',
    sections: [
      { id: 'record-the-decision', title: 'Log an actual denial', blocks: [
        { type: 'paragraph', text: 'The compiled gate does not write evidence automatically. This example catches the refund’s actual InvariantViolation, records allowed=false with writeGateDecision, then inspects a persistent JSONL store. Download the matching first_gate file from the earlier guide into the same project.' },
        { type: 'code-group', samples: ledgerSamples },
        { type: 'code-group', samples: [
          { label: 'Run TypeScript', language: 'bash', code: 'npx tsc\nnode dist/ledger_evidence.js' },
          { label: 'Run JavaScript', language: 'bash', code: 'node ledger_evidence.mjs' },
        ] },
        { type: 'paragraph', text: 'On a fresh file, expect Integrity: true and Lifecycle complete: false. The missing drift_flagged_monitor_has_pre_node evidence is deliberate. Re-running appends another denied decision, not a reset. This is a logging lesson, not a complete recovery workflow.' },
      ] },
      { id: 'complete-the-lifecycle', title: 'Integrity and audit answer different questions', blocks: [
        { type: 'table', headers: ['Check', 'What it tells you'], rows: [
          ['await ledger.verifyIntegrity()', 'The stored entries form a valid hash chain; this alone does not prove external truth or complete history.'],
          ['(await ledger.audit()).allPassed', 'The recorded lifecycle satisfies the built-in causal evidence checks; this does not certify legal compliance.'],
          ['decisionId', 'Groups records belonging to the same decision.'],
          ['causedBy', 'Links a follow-up record to the exact prior entryId it resolves.'],
        ] },
        { type: 'list', ordered: true, items: ['A drift-flagged MONITOR needs a causally linked PRE_NODE record describing the intervention.', 'That PRE_NODE needs a linked VERIFICATION describing the actual outcome.', 'An INSUFFICIENT verification needs a SPECIFICATION_UPDATE; a TERMINAL record needs a HUMAN_AUTHORISED_TRANSITION for its audit requirement.', 'Only record actions that really happened. Do not manufacture recovery or human-authorization evidence to make allPassed true.'] },
        { type: 'paragraph', text: 'For a PreNode, pass the same monitor estimate used for that decision together with gammaThreshold to writeGateDecision. For an Invariant, pass the observed allowed boolean. Do not re-run a nondeterministic monitor merely to reconstruct evidence, and do not proceed with an irreversible action when a required evidence write fails.' },
      ] },
      { id: 'storage-boundary', title: 'Respect the storage boundary', blocks: [
        { type: 'callout', tone: 'warning', title: 'One Node process per JSONL file', text: 'The TS/JS JsonlLedgerStore serializes writers only within a Node process. It does not provide the Python store’s cross-process file locking. Do not let separate processes or machines append to one file. Use a suitably coordinated LedgerStore implementation for that deployment.' },
        { type: 'paragraph', text: 'LedgerStore methods return Promises or AsyncIterables. Await writes, verification, audit, and checkpoints; use for await to iterate entries. An in-memory store is the default and does not survive process exit. Durable evidence also needs your application’s retention, access, and external anchoring policy.' },
      ] },
    ],
    sources: [{ title: 'Ledger methods, options and audit', href: `${source}/ledger.ts` }, { title: 'Documented storage differences', href: `${core}#where-this-diverges-from-vsl-core` }],
  },
  {
    slug: 'testing', title: 'Prove the boundary holds.',
    description: 'Test behavior, not just return values. Run the same allow/deny and error-propagation checks against TypeScript and JavaScript.',
    group: 'Build & verify', eyebrow: 'STEP 05 / TESTING',
    sections: [
      { id: 'run-the-examples', title: 'Run both language variants', blocks: [
        { type: 'paragraph', text: 'Download all six examples from the first-gate, thresholds, and ledger pages, plus test_gates.mjs below, into the same tutorial project. Compile the three .ts files with the installation guide’s tsconfig.json. The test runner imports compiled TypeScript from dist and JavaScript directly from the project root.' },
        { type: 'code', sample: { label: 'test_gates.mjs', language: 'javascript', code: gateTests }, download: new URL('./examples/tsjs/test_gates.mjs', import.meta.url).href },
        { type: 'code', sample: { label: 'Run Node’s built-in test runner', language: 'bash', code: 'npx tsc\nnode --test test_gates.mjs' } },
        { type: 'list', items: ['Allowed amounts, including both boundaries, reach the side effect exactly once.', 'Denied and malformed candidates never reach the action.', 'Application failures propagate rather than being converted to successful or denied responses.', 'Gamma equality denies, and the estimation allowance is not counted twice.', 'Reference-adapter conformance is awaited and returns no failures.', 'JSONL evidence survives reopening, while an unresolved denied decision still fails the lifecycle audit.'] },
      ] },
      { id: 'adapter-conformance', title: 'Await adapter conformance', blocks: [
        { type: 'code', sample: { label: 'Conformance contract / TS or JS', language: 'javascript', code: "import assert from 'node:assert/strict'\nimport { PlainJsReferenceAdapter, runConformanceSuite } from '@supersemantics/vsl-core'\n\nconst failures = await runConformanceSuite(new PlainJsReferenceAdapter())\nassert.deepEqual(failures, [])" } },
        { type: 'callout', tone: 'note', title: 'Different from Python', text: 'Python’s run_conformance_suite is synchronous. The TS/JS runConformanceSuite returns Promise<string[]> and must be awaited. Passing conformance checks the adapter contract, not the correctness of your policy, action, or end-to-end application.' },
      ] },
    ],
    sources: [{ title: 'Conformance suite checks', href: `${source}/conformance/suite.ts` }, { title: 'VSLAdapter interface', href: `${source}/conformance/protocol.ts` }],
  },
  {
    slug: 'integrations', title: 'Bring the gate to LangGraph.js.',
    description: 'Compile a policy for a framework node, await the gate before execution, and route denials explicitly. The adapter does not own your application lifecycle.',
    group: 'Go further', eyebrow: 'STEP 06 / FRAMEWORK INTEGRATION',
    sections: [
      { id: 'adapter-installation', title: 'Use the separate adapter', blocks: [
        { type: 'paragraph', text: 'VSL-Corejs is framework-agnostic. LangGraphAdapter, gatedNode, routeOnDenial, and DEFAULT_DENIAL_KEY come from @supersemantics/vsl-langgraph, not from core. Its upstream README currently directs users to a GitHub install and says it is not yet published to npm.' },
        { type: 'code', sample: { label: 'Upstream source-install command', language: 'bash', code: 'npm install github:supersemantics/VSL-Langgraphjs#master\nnpm ls @supersemantics/vsl-core @supersemantics/vsl-langgraph @langchain/langgraph' } },
        { type: 'callout', tone: 'warning', title: 'Review the dependency graph', text: 'The reviewed adapter manifest pins its core dependency to the v0.2.0 GitHub tag, while these core examples target the 0.2.2 source manifest. Verify the installed versions and avoid mixing incompatible or duplicate core instances in error handling. Use a reviewed, compatible dependency set and rerun conformance; do not assume all alpha revisions are interchangeable.' },
      ] },
      { id: 'wire-before-the-action', title: 'Wrap the action and route the denial', blocks: [
        { type: 'paragraph', text: 'The following is a JavaScript wiring sketch for an existing graph. It assumes your StateGraph schema already defines amount, result, and vslDenial. Pass the selected candidate explicitly. For TypeScript, give state the type derived from your graph’s schema rather than casting unknown input.' },
        { type: 'code', sample: { label: 'Existing graph / JavaScript wiring', language: 'javascript', code: "import { END } from '@langchain/langgraph'\nimport { LangGraphAdapter, gatedNode, routeOnDenial } from '@supersemantics/vsl-langgraph'\nimport { refundPolicy } from './first_gate.mjs'\n\nconst gate = new LangGraphAdapter().compileInvariant(refundPolicy)\nconst approve = gatedNode(\n  gate,\n  async state => ({ result: `approved ${state.amount}` }),\n  { candidateInputFn: state => ({ amount: state.amount }) },\n)\n\n// Add these nodes and edges to your configured StateGraph.\ngraph.addNode('approve', approve)\ngraph.addNode('blocked', async () => ({ result: 'blocked' }))\ngraph.addConditionalEdges('approve', routeOnDenial('blocked', END))\ngraph.addEdge('blocked', END)" } },
        { type: 'list', items: ['Add your START edge and compile/invoke the graph using your application’s schema and runtime.', 'gatedNode awaits the gate before invoking the wrapped node. A caught AutomationDeniedException becomes a vslDenial state update.', 'routeOnDenial routes a state with that key to the blocked node; unrelated errors propagate.', 'Use a fresh state for a new attempt or deliberately clear a previous vslDenial value. A stale denial must not accidentally route a later allowed attempt to blocked.', 'An InvariantViolation is terminal policy information. Treat blocked as a terminal handling path, not permission to retry the same prohibited action.'] },
        { type: 'callout', tone: 'note', title: 'Source-reviewed integration sketch', text: 'This section explains the adapter’s actual wiring contract. It is not a complete runnable agent and was not executed against LangGraph.js in the restricted development environment. The upstream repository includes a complete StateGraph example and integration tests.' },
      ] },
      { id: 'what-you-still-own', title: 'Keep ownership explicit', blocks: [
        { type: 'list', items: ['gatedNode does not consume PreNode.fallback, implement a retry loop, or apply a stabilisation intervention. Your application must own those behaviors.', 'No helper writes ledger records for you. Implement real, causally linked MONITOR, PRE_NODE, and VERIFICATION evidence where required.', 'The adapter’s hosted-API warning inspects only the monitor/rule’s own source text. It does not follow helper functions and cannot prove an F2 assurance claim.', 'Do not infer a supported LangChain.js adapter from the existence of the Python LangChain package. Use only a verified adapter or implement the VSLAdapter contract and test it.'] },
        { type: 'links', items: [
          { title: 'Upstream LangGraph.js example', description: 'Read the complete graph, schema, and current installation notes.', href: `${adapter}#readme` },
          { title: 'Real adapter integration tests', description: 'Check allow, deny, and error-propagation behavior upstream.', href: `${adapter}/blob/master/tests/integration.test.ts` },
        ] },
      ] },
    ],
    sources: [{ title: 'LangGraph.js adapter README', href: `${adapter}#readme` }, { title: 'gatedNode and routeOnDenial', href: `${adapter}/blob/master/src/integration.ts` }, { title: 'Adapter dependency versions', href: `${adapter}/blob/master/package.json` }],
  },
  {
    slug: 'reference', title: 'API map & troubleshooting.',
    description: 'Find the right primitive, translate Python concepts accurately, and diagnose the most common Node.js integration mistakes.',
    group: 'Go further', eyebrow: 'REFERENCE / KEEP NEARBY',
    sections: [
      { id: 'api-map', title: 'The small API map', blocks: [
        { type: 'table', headers: ['API', 'Use it for'], rows: [
          ['Invariant / compileInvariant', 'An async boolean hard constraint; violation throws InvariantViolation.'],
          ['PreNode / compilePreNode', 'A monitor returning Promise<GammaEstimate>; insufficient Gamma denies.'],
          ['AssuranceBasis / F2Modification', 'Explicit F1/F2 facts from which assuranceLevel is derived.'],
          ['VerbaLedger / LedgerStore', 'Async decision evidence, integrity, lifecycle audit, and persistence.'],
          ['Fallback / TerminalState', 'Policy declarations; not a built-in application recovery engine.'],
          ['runConformanceSuite(adapter)', 'Await Promise<string[]>; an empty array means no conformance failures.'],
          ['catalog', 'Drift-class and stabilisation data; not a finished detection system.'],
        ] },
      ] },
      { id: 'coming-from-python', title: 'Coming from Python?', blocks: [
        { type: 'table', headers: ['Python', 'TypeScript / JavaScript'], rows: [
          ['vsl_core', '@supersemantics/vsl-core'],
          ['PlainPythonReferenceAdapter', 'PlainJsReferenceAdapter'],
          ['gamma_hat / delta_estimation_error', 'gammaHat / deltaEstimationError'],
          ['compile_pre_node / compile_invariant', 'compilePreNode / compileInvariant'],
          ['write_gate_decision / verify_integrity', 'await writeGateDecision / await verifyIntegrity'],
          ['audit().all_passed', '(await audit()).allPassed'],
          ['run_conformance_suite(adapter)', 'await runConformanceSuite(adapter)'],
          ['Synchronous store iteration', 'for await (const entry of store.allEntries())'],
        ] },
        { type: 'links', items: [{ title: 'Python learning path', description: 'The existing Python guides remain available at their original URLs.', href: '/docs' }] },
      ] },
      { id: 'troubleshooting', title: 'When something feels wrong', blocks: [
        { type: 'table', headers: ['Symptom', 'Check this first'], rows: [
          ['Public npm access is blocked', 'Respect your IT policy. Ask for approved packages; do not change security settings or bypass the block.'],
          ['ERR_MODULE_NOT_FOUND', 'Check installed dependencies, type=module, compiled .js imports, and that npx tsc completed.'],
          ['TypeScript files do not run', 'Compile them first with the documented NodeNext setup, or use the plain .mjs variants.'],
          ['The action runs despite denial', 'Await the gate immediately before the side effect. Never swallow a denial and continue.'],
          ['Gamma at 1.1 is denied', 'The condition is strict >, not >=. Check declared estimation error too.'],
          ['Integrity is true but audit fails', 'Inspect checksFailed and violations for missing causal lifecycle records.'],
          ['LangGraph routes a new attempt as denied', 'Check stale vslDenial state and duplicate core dependencies.'],
          ['JSONL chain breaks under concurrency', 'Do not share one file across Node processes; implement coordinated persistence.'],
        ] },
        { type: 'callout', tone: 'note', title: 'No TypeScript scanner is implied', text: 'The governance-scanning Python guide documents the separate scanner project. This TS/JS path does not invent a Node scanner API or equate static scores with runtime Gamma. Check that project’s documented interfaces for your use case.' },
      ] },
    ],
    sources: [{ title: 'Core public exports', href: `${source}/index.ts` }, { title: 'Core README and caveats', href: `${core}#readme` }, { title: 'Canonical Python design', href: 'https://github.com/supersemantics/VSL-Core' }],
  },
]
