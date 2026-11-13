import firstGate from './examples/first_gate.py?raw'
import thresholdGate from './examples/threshold_gate.py?raw'
import ledgerEvidence from './examples/ledger_evidence.py?raw'
import gateTests from './examples/test_first_gate.py?raw'

export type CodeLanguage = 'python' | 'typescript' | 'javascript' | 'json' | 'bash' | 'text' | 'yaml'
export type CodeSample = { label: string; language: CodeLanguage; code: string; download?: string }
export type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'code'; sample: CodeSample; download?: string }
  | { type: 'code-group'; samples: CodeSample[] }
  | { type: 'callout'; tone: 'note' | 'warning' | 'tip'; title: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'links'; items: { title: string; description: string; href: string }[] }

export interface DocPage {
  slug: string
  title: string
  description: string
  group: string
  eyebrow: string
  sections: { id: string; title: string; blocks: DocBlock[] }[]
  sources: { title: string; href: string }[]
}

const core = 'https://github.com/supersemantics/VSL-Core'
const coreDocs = `${core}/blob/main/docs`
const starters = 'https://github.com/supersemantics/supersemantics-VSL-Starters'
const examples = {
  firstGate: new URL('./examples/first_gate.py', import.meta.url).href,
  thresholdGate: new URL('./examples/threshold_gate.py', import.meta.url).href,
  ledgerEvidence: new URL('./examples/ledger_evidence.py', import.meta.url).href,
  tests: new URL('./examples/test_first_gate.py', import.meta.url).href,
}

export function docHref(slug: string, track: 'python' | 'typescript' = 'python') {
  const base = track === 'python' ? '/docs' : '/docs/typescript'
  return slug === 'introduction' ? base : `${base}/${slug}`
}

export const docPages: DocPage[] = [
  {
    slug: 'introduction', title: 'Build autonomy. Keep authority.',
    description: 'A practical Python guide to governing consequential actions with VSL. Start with one rule, put it before an action, and prove that a denied action never ran.',
    group: 'Getting started', eyebrow: 'WELCOME TO THE DEVELOPER DOCS',
    sections: [
      { id: 'what-is-vsl', title: 'Governance belongs before the action', blocks: [
        { type: 'paragraph', text: 'VSL-Core is a framework- and model-agnostic Python library. It gives you governance primitives, compiled gates, and a hash-chained ledger. Your application decides where to place the gates and what to do when they deny an action.' },
        { type: 'callout', tone: 'note', title: 'A library, not an invisible safety layer', text: 'Installing VSL-Core does not intercept your tools, validate your policies, or make an application compliant. The gate must be called before the side effect, and your application must explicitly record and handle the result.' },
        { type: 'table', headers: ['Layer', 'What it does'], rows: [
          ['Define', 'Express a hard rule with an Invariant or a measured prerequisite with a PreNode.'],
          ['Act + check', 'Compile the primitive, then await the gate immediately before the action.'],
          ['Prove', 'Write the actual decision and lifecycle events into a VerbaLedger.'],
        ] },
      ] },
      { id: 'learning-path', title: 'Your learning path', blocks: [
        { type: 'links', items: [
          { title: '01 / Set up Python', description: 'Create an environment and install the core library.', href: '/docs/installation' },
          { title: '02 / Build your first gate', description: 'Allow one refund, block another, and check the side effect.', href: '/docs/first-gate' },
          { title: '03 / Add measured thresholds', description: 'Use a PreNode and understand robust Gamma.', href: '/docs/thresholds' },
          { title: '04 / Preserve the evidence', description: 'Record decisions and distinguish integrity from audit completeness.', href: '/docs/ledger' },
          { title: '05 / Test the boundary', description: 'Prove allowed, denied, invalid-input, and threshold behavior.', href: '/docs/testing' },
          { title: '06 / Connect your framework', description: 'Choose the right Python adapter or an offline starter.', href: '/docs/integrations' },
        ] },
      ] },
      { id: 'before-you-start', title: 'Before you start', blocks: [
        { type: 'list', items: ['Python 3.10 or later, a terminal, and basic familiarity with async / await.', 'No model API key or agent framework is needed for the core tutorials.', 'The examples use integer cents and an in-memory stand-in. They do not call a payment provider.'] },
        { type: 'callout', tone: 'tip', title: 'Learn from code you can actually run', text: 'The downloadable Python examples and eight tests were executed against the upstream VSL-Core 0.3.1 source. This guide currently covers Python only. Repository documentation remains the authority for APIs and release-specific behavior.' },
      ] },
    ],
    sources: [{ title: 'VSL-Core overview', href: `${core}#readme` }, { title: 'Upstream building guide', href: `${coreDocs}/building-with-vsl-core.md` }, { title: 'VSL Starters', href: starters }],
  },
  {
    slug: 'installation', title: 'Set up your environment',
    description: 'Install the framework-agnostic core. You can learn the entire gate lifecycle without connecting a model or an external service.',
    group: 'Getting started', eyebrow: 'STEP 01 / INSTALLATION',
    sections: [
      { id: 'create-environment', title: '1. Create a Python environment', blocks: [
        { type: 'paragraph', text: 'Use Python 3.10 or newer. A virtual environment keeps the tutorial packages separate from your other projects.' },
        { type: 'code-group', samples: [
          { label: 'Windows · PowerShell', language: 'bash', code: 'mkdir vsl-tutorial\ncd vsl-tutorial\npython -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1' },
          { label: 'macOS / Linux', language: 'bash', code: 'mkdir vsl-tutorial\ncd vsl-tutorial\npython3 -m venv .venv\nsource .venv/bin/activate' },
        ] },
        { type: 'callout', tone: 'note', title: 'If PowerShell does not allow activation', text: 'You do not need to change your machine-wide execution policy. Use .\\.venv\\Scripts\\python.exe in place of python for installation and tutorial commands.' },
      ] },
      { id: 'install-core', title: '2. Install VSL-Core', blocks: [
        { type: 'code', sample: { label: 'Terminal', language: 'bash', code: 'python -m pip install super-semantics-vsl\npython -c "import vsl_core; print(\'VSL-Core is ready\')"' } },
        { type: 'callout', tone: 'warning', title: 'Distribution name ≠ import name', text: 'Install super-semantics-vsl. Import vsl_core. Do not substitute pip install vsl-core: that is not the distribution specified by this repository.' },
        { type: 'paragraph', text: 'The core has no required third-party runtime dependencies. Framework adapters and optional storage integrations have their own dependencies.' },
      ] },
      { id: 'check-version', title: '3. Check your version', blocks: [
        { type: 'code', sample: { label: 'Terminal', language: 'bash', code: 'python -c "from importlib.metadata import version; print(version(\'super-semantics-vsl\'))"' } },
        { type: 'paragraph', text: 'This guide was checked against VSL-Core source version 0.3.1. In particular, the ledger guide uses write_gate_decision. If an installed release differs, check its changelog and source before adapting the examples.' },
      ] },
      { id: 'from-source', title: 'Working from source', blocks: [
        { type: 'paragraph', text: 'For contribution work, or if your package index does not carry the required release, use the repository installation path inside your virtual environment.' },
        { type: 'code', sample: { label: 'Terminal', language: 'bash', code: 'git clone https://github.com/supersemantics/VSL-Core.git\ncd VSL-Core\npython -m pip install -e .' } },
        { type: 'paragraph', text: 'The main branch can change. Pin a reviewed commit in your own dependency management when you need a reproducible source installation.' },
      ] },
    ],
    sources: [{ title: 'Official installation instructions', href: `${core}#install` }, { title: 'Python requirement and package metadata', href: `${core}/blob/main/pyproject.toml` }],
  },
  {
    slug: 'first-gate', title: 'Your first governed action',
    description: 'Build a small refund boundary in plain Python. One request passes, one is denied, and the denied request never reaches the stand-in for the real action.',
    group: 'Getting started', eyebrow: 'STEP 02 / YOUR FIRST GATE',
    sections: [
      { id: 'choose-boundary', title: '1. Pick a consequential boundary', blocks: [
        { type: 'paragraph', text: 'Start at the point where a decision becomes an external effect: a refund, message, database write, deletion, or permission-sensitive read. For this tutorial, the hard rule is simple: a refund must be a positive integer amount no greater than 50,000 cents.' },
        { type: 'callout', tone: 'warning', title: 'An intentionally small policy', text: 'This cap is a teaching example, not a complete refund policy. A real system also needs trusted customer identity, order ownership, remaining refundable value, idempotency, and protection against concurrent state changes.' },
      ] },
      { id: 'write-gate', title: '2. Construct, compile, and call', blocks: [
        { type: 'paragraph', text: 'Save the following as first_gate.py. An Invariant expresses a hard rule. PlainPythonReferenceAdapter turns it into an awaitable gate. The side effect is deliberately placed after await gate(candidate), not before it.' },
        { type: 'code', sample: { label: 'first_gate.py', language: 'python', code: firstGate }, download: examples.firstGate },
        { type: 'callout', tone: 'note', title: 'The reference adapter is a teaching baseline', text: 'It is a real conformant direct-call adapter, but its exception identity is conformance-test. Use a suitable framework adapter or an application-specific conformant implementation for production identity and orchestration requirements.' },
      ] },
      { id: 'run-example', title: '3. Run both paths', blocks: [
        { type: 'code', sample: { label: 'Terminal', language: 'bash', code: 'python first_gate.py' } },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: 'ALLOWED: 20000\nBLOCKED: 90000\nOnly the allowed action ran.' } },
        { type: 'paragraph', text: 'The output alone is not the proof. The assertion checks that executed_refunds contains only the allowed amount. The tests later verify the denied and malformed-input cases independently.' },
      ] },
      { id: 'assurance', title: '4. State the assurance honestly', blocks: [
        { type: 'paragraph', text: 'This gate runs before the action, so F1 is true. It does not change a model’s logits, weights, prompt, context, or sampling, so F2 is NONE. Its derived assurance is LOW. That describes influence on the model, not whether the gate blocks the action.' },
        { type: 'paragraph', text: 'The library raises a denial. Your application owns the catch, any user-facing response, ledger writes, and the decision to stop or escalate. Nothing here automatically creates a TerminalState or records a ledger entry.' },
      ] },
    ],
    sources: [{ title: 'Construct → compile → call → log → escalate', href: `${coreDocs}/building-with-vsl-core.md` }, { title: 'Plain Python reference adapter', href: `${core}/blob/main/src/vsl_core/conformance/reference_adapter.py` }, { title: 'Invariant API', href: `${core}/blob/main/src/vsl_core/constructs.py` }],
  },
  {
    slug: 'thresholds', title: 'Rules, thresholds, and assurance',
    description: 'Choose the primitive that matches your boundary. Use hard rules for conditions that must hold, and measured prerequisites when you have a defensible score and threshold.',
    group: 'Core primitives', eyebrow: 'STEP 03 / MEASURED PREREQUISITES',
    sections: [
      { id: 'pick-primitive', title: 'Invariant or PreNode?', blocks: [
        { type: 'table', headers: ['Primitive', 'Your callable returns', 'Use it for'], rows: [
          ['Invariant', 'An awaitable bool', 'A hard rule, such as ownership or an absolute refund cap.'],
          ['PreNode', 'An awaitable GammaEstimate', 'A measured prerequisite, such as remaining budget / requested amount.'],
          ['TerminalState', 'Policy data, not a running controller', 'A named state requiring explicit application halt and recovery handling.'],
        ] },
      ] },
      { id: 'build-monitor', title: 'Build a measured budget gate', blocks: [
        { type: 'paragraph', text: 'In this independent example, Gamma is available budget divided by requested amount. A value of 1.0 is break-even. Invalid or missing amounts produce 0.0, which the compiled gate denies. Save it as threshold_gate.py.' },
        { type: 'code', sample: { label: 'threshold_gate.py', language: 'python', code: thresholdGate }, download: examples.thresholdGate },
        { type: 'code', sample: { label: 'Run', language: 'bash', code: 'python threshold_gate.py' } },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: '50000: allowed\n100000: blocked\n0: blocked' } },
      ] },
      { id: 'strict-threshold', title: 'Understand the strict comparison', blocks: [
        { type: 'paragraph', text: 'In the checked source, sufficient(threshold) requires gamma_hat > max(threshold, 1 + delta_estimation_error). The default threshold is 1.1. Equality does not pass. The library does not measure Gamma for you or validate that your score is meaningful.' },
        { type: 'code', sample: { label: 'Threshold boundaries', language: 'python', code: 'from vsl_core.metrics import GammaEstimate\n\nassert not GammaEstimate(gamma_hat=1.1).sufficient()\nassert GammaEstimate(gamma_hat=1.11).sufficient()\nassert not GammaEstimate(\n    gamma_hat=1.2, delta_estimation_error=0.3\n).sufficient()' } },
        { type: 'callout', tone: 'warning', title: 'Do not confuse two different Gamma measures', text: 'Runtime GammaEstimate is a domain-defined ratio with a robust gate threshold. The X-Verba scanner’s structural Gamma is coverage between 0 and 1. A scanner coverage score is not a suitable runtime GammaEstimate.' },
      ] },
      { id: 'f1-f2', title: 'F1 and F2 are separate facts', blocks: [
        { type: 'table', headers: ['Pattern', 'F1 / F2', 'Derived assurance'], rows: [
          ['Pre-action refund cap, no model shaping', 'True / NONE', 'LOW'],
          ['Before a hosted model call, application shapes its prompt or context', 'True / PARTIAL', 'MEDIUM'],
          ['Before a model call, application actually steers logits or activations', 'True / FULL', 'HIGH'],
          ['A check only after the effect has happened', 'False / any', 'LOW'],
        ] },
        { type: 'paragraph', text: 'AssuranceBasis requires real bool and F2Modification values. The level is derived and read-only. The declaration is structurally checked, but the library does not independently prove your F1/F2 claim.' },
        { type: 'callout', tone: 'note', title: 'Fallback is not an automatic retry engine', text: 'A PreNode can carry Fallback policy data. The plain reference adapter and the documented Python framework adapters do not turn those fields into a retry loop for you. Implement retries, limits, and re-evaluation explicitly in your application.' },
      ] },
    ],
    sources: [{ title: 'GammaEstimate and assurance rules', href: `${core}/blob/main/src/vsl_core/metrics.py` }, { title: 'F1/F2 explanation', href: `${core}#the-f1f2-assurance-distinction-read-this-before-trusting-any-assurance-level` }],
  },
  {
    slug: 'ledger', title: 'Keep evidence, not just logs',
    description: 'Record the decision the gate actually made. Then check the hash chain and the governance lifecycle as two separate questions.',
    group: 'Core primitives', eyebrow: 'STEP 04 / VERBA LEDGER',
    sections: [
      { id: 'record-decisions', title: 'Record each real gate decision', blocks: [
        { type: 'paragraph', text: 'write_gate_decision creates a standard MONITOR record. For an Invariant, pass the actual allowed bool. For a PreNode, pass the same GammaEstimate and gamma_threshold used by the gate. The helper rejects contradictory values.' },
        { type: 'callout', tone: 'note', title: 'This is a recording demonstration', text: 'The following independent example writes one allowed and one denied decision to demonstrate the ledger APIs. It does not itself execute a gate. In your application, write these values from the actual rule or monitor evaluation, never from a result you assume will happen.' },
        { type: 'code', sample: { label: 'ledger_evidence.py', language: 'python', code: ledgerEvidence }, download: examples.ledgerEvidence },
        { type: 'code', sample: { label: 'Run', language: 'bash', code: 'python ledger_evidence.py' } },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: 'Chain intact: True\nLifecycle complete: False\nUnresolved checks: drift_flagged_monitor_has_pre_node' } },
      ] },
      { id: 'integrity-and-audit', title: 'Integrity is not lifecycle completeness', blocks: [
        { type: 'paragraph', text: 'verify_integrity() checks the hash chain against the records currently available. audit() checks lifecycle relationships in those records. The example deliberately leaves a denied decision unresolved, so the chain is valid while the lifecycle audit fails.' },
        { type: 'list', items: ['A denied MONITOR needs the appropriate PRE_NODE follow-up; a PRE_NODE needs VERIFICATION.', 'An insufficient verification needs the corresponding specification update. A terminal record needs a human-authorised transition.', 'Use decision_id to group a decision and caused_by to link the exact causal record when decisions overlap.', 'Record real recovery events. Do not fabricate follow-up records merely to make audit().all_passed return true.'] },
        { type: 'callout', tone: 'warning', title: 'An audit pass is not certification', text: 'These checks evaluate the supplied records, not whether your policy is correct or your deployment satisfies a regulation. If max_monitor_gap_seconds is not supplied, the monitoring-gap check is skipped. Integrity alone cannot prove records were never omitted or that a whole chain was not replaced.' },
      ] },
      { id: 'persistent-storage', title: 'Choose a storage boundary', blocks: [
        { type: 'paragraph', text: 'VerbaLedger defaults to InMemoryLedgerStore. For a local append-only file, construct it with JsonlLedgerStore. Optional immudb support is separate; review its deployment and trust requirements before use.' },
        { type: 'code', sample: { label: 'Local persistence', language: 'python', code: 'from vsl_core.ledger import JsonlLedgerStore, VerbaLedger\n\nledger = VerbaLedger(store=JsonlLedgerStore("governance.jsonl"))\nledger.write_gate_decision(\n    identity_key="refund-agent",\n    primitive_name="refund-within-limit",\n    allowed=True,\n    decision_id="refund-003",\n)\nassert ledger.verify_integrity()' } },
        { type: 'paragraph', text: 'Protect the stored evidence, retain it according to your requirements, and consider independently witnessed checkpoints where stronger tamper evidence is needed. A hash chain is not a substitute for access control or external anchoring.' },
      ] },
    ],
    sources: [{ title: 'Ledger API and audit implementation', href: `${core}/blob/main/src/vsl_core/ledger.py` }, { title: 'Causal correlation and troubleshooting', href: `${coreDocs}/troubleshooting.md` }],
  },
  {
    slug: 'testing', title: 'Test the boundary, not the message',
    description: 'An error message is not enough. Your tests should prove the forbidden action was never reached, and that allowed actions still work.',
    group: 'Build & verify', eyebrow: 'STEP 05 / TESTING YOUR GATES',
    sections: [
      { id: 'download-tests', title: '1. Keep the examples together', blocks: [
        { type: 'paragraph', text: 'Save first_gate.py, threshold_gate.py, and ledger_evidence.py from the previous guides in one directory. Save this test file alongside them. It uses Python’s standard unittest library, with no extra test dependency.' },
        { type: 'code', sample: { label: 'test_first_gate.py', language: 'python', code: gateTests }, download: examples.tests },
      ] },
      { id: 'run-tests', title: '2. Run the tests', blocks: [
        { type: 'code', sample: { label: 'From the directory containing the four files', language: 'bash', code: 'python -m unittest -v test_first_gate' } },
        { type: 'paragraph', text: 'All eight tests should pass. ALLOWED and BLOCKED lines are emitted by the tutorial function and are expected. The side-effect list is cleared before each async test so results do not leak across cases.' },
      ] },
      { id: 'production-checklist', title: '3. Extend the checks for your domain', blocks: [
        { type: 'list', ordered: true, items: ['Test one clearly allowed input and one clearly denied input per gate.', 'Assert the action or provider call did not happen on denial, not merely that an exception was raised.', 'Test missing, malformed, boundary, and untrusted values. Check the exact strict Gamma comparison.', 'Make monitor failures fail closed. Do not catch a RuntimeError and continue to the real action.', 'Test terminal-state handling, human authorisation, and ledger correlation as explicit application behaviors.', 'Test races between checking state and committing an effect, plus duplicate requests and provider failures.'] },
      ] },
      { id: 'conformance', title: 'Building your own adapter?', blocks: [
        { type: 'paragraph', text: 'Run the upstream conformance suite against your adapter. An empty failure list checks the contract; it does not prove that every integration in your application is wired correctly.' },
        { type: 'code', sample: { label: 'Conformance check', language: 'python', code: 'from vsl_core.conformance.reference_adapter import PlainPythonReferenceAdapter\nfrom vsl_core.conformance.suite import run_conformance_suite\n\nfailures = run_conformance_suite(PlainPythonReferenceAdapter())\nassert failures == [], failures' } },
      ] },
    ],
    sources: [{ title: 'VSL adapter conformance suite', href: `${core}/blob/main/src/vsl_core/conformance/suite.py` }, { title: 'Testing framework gates', href: 'https://github.com/supersemantics/VSL-Langgraph/blob/main/docs/testing-your-gates.md' }],
  },
  {
    slug: 'scanning', title: 'Find the gaps in your code',
    description: 'Use the X-Verba CLI to inspect a repository for structural governance gaps. Then turn findings into explicit runtime boundaries.',
    group: 'Build & verify', eyebrow: 'GOVERNANCE SCANNING',
    sections: [
      { id: 'install-scanner', title: 'Install the separate scanner', blocks: [
        { type: 'paragraph', text: 'X-Verba CLI is a separate package from VSL-Core. Its upstream installation instructions require Python 3.10 or newer.' },
        { type: 'code', sample: { label: 'Terminal', language: 'bash', code: 'python -m pip install x-verba\nx-verba scan .' } },
        { type: 'paragraph', text: 'Run the scan from the repository you want to inspect. The documented report location is .verba/governance.yaml. Findings identify decision points, existing safeguards, and possible gaps for you to review.' },
        { type: 'callout', tone: 'warning', title: 'Pattern-based analysis, not a runtime guarantee', text: 'Expect false positives and coverage limits. Structural Gamma is the proportion of detected decision points with safeguards, on a 0–1 scale. It does not establish that a policy is sensible, a gate actually blocks, or a deployment is compliant.' },
      ] },
      { id: 'review-findings', title: 'Review before setting a baseline', blocks: [
        { type: 'list', ordered: true, items: ['Inspect each consequential operation and confirm it is a real boundary in your application.', 'Identify the trusted inputs, human authority, and conditions the action requires.', 'Implement and test the actual runtime gate. A YAML policy description does not enforce itself.', 'Review remaining gaps and detector limitations before accepting a baseline.'] },
        { type: 'paragraph', text: 'The CLI documents --all-frameworks for expanding provider detection beyond the default OpenAI, LangChain, and LangGraph set. Consult the scanner repository for supported languages and current detector behavior.' },
      ] },
      { id: 'baseline-ci', title: 'Check structural regressions in CI', blocks: [
        { type: 'code', sample: { label: 'Create the reviewed baseline, then check against it', language: 'bash', code: 'x-verba scan . --save-baseline\nx-verba qa . --schema .verba/governance-baseline.json' } },
        { type: 'paragraph', text: 'Commit a reviewed baseline in your own repository and invoke qa in CI. The upstream guide states --fail-on-critical is enabled by default. Keep your executable gate tests alongside this structural check; neither replaces the other.' },
        { type: 'callout', tone: 'note', title: 'Command availability is release-specific', text: 'The upstream README marks forensics, prompt, and compile as not yet implemented. This guide does not present them as usable commands. Use the current CLI help and source when upgrading.' },
      ] },
    ],
    sources: [{ title: 'X-Verba CLI installation and quickstart', href: 'https://github.com/supersemantics/X-verba-CLI#installation' }, { title: 'Structural Gamma and limitations', href: 'https://github.com/supersemantics/X-verba-CLI#understanding-the-gamma-score-Γ' }],
  },
  {
    slug: 'integrations', title: 'Take the gate into your framework',
    description: 'Keep the governance vocabulary in VSL-Core. Use a Python adapter to place the compiled gate in the framework’s execution path.',
    group: 'Ecosystem', eyebrow: 'PYTHON FRAMEWORK INTEGRATIONS',
    sections: [
      { id: 'choose-adapter', title: 'Choose the right execution boundary', blocks: [
        { type: 'table', headers: ['Package', 'Execution boundary'], rows: [
          ['vsl-langgraph', 'Explicit gated_node wiring and conditional route_on_denial edges.'],
          ['vsl-langchain', 'Named tool calls through VSLToolMiddleware on create_agent (LangChain ≥ 1.0).'],
          ['vsl-maf', 'VSLFunctionMiddleware registered on a Microsoft Agent Framework Agent.'],
        ] },
        { type: 'callout', tone: 'note', title: 'The snippets below are integration wiring', text: 'These are not standalone agents. They reuse policy from first_gate.py and assume your framework graph, tools, or Agent already exist. Use the linked upstream starter for a complete offline application. Ledger writes, retries, terminal handling, and recovery still belong to your code.' },
      ] },
      { id: 'langgraph', title: 'LangGraph: make the route explicit', blocks: [
        { type: 'code', sample: { label: 'Install', language: 'bash', code: 'python -m pip install vsl-langgraph' } },
        { type: 'code', sample: { label: 'Inside an existing StateGraph', language: 'python', code: 'from first_gate import policy\nfrom vsl_langgraph import LangGraphAdapter, gated_node, route_on_denial\n\ngate = LangGraphAdapter().compile_invariant(policy)\ngraph.add_node("refund", gated_node(gate, refund_action))\ngraph.add_conditional_edges(\n    "refund", route_on_denial("blocked", "done")\n)' } },
        { type: 'paragraph', text: 'Your graph must define refund_action, the blocked and done destinations, and its normal entry and end edges. On denial, the action is skipped and the denial route is selected. If you chain gates, use distinct denial_key values so one result does not collide with another.' },
      ] },
      { id: 'langchain', title: 'LangChain: gate named tools', blocks: [
        { type: 'code', sample: { label: 'Install', language: 'bash', code: 'python -m pip install vsl-langchain' } },
        { type: 'code', sample: { label: 'Prepare middleware for create_agent', language: 'python', code: 'from dataclasses import replace\nfrom first_gate import policy, within_refund_limit\nfrom vsl_langchain import LangChainAdapter, VSLToolMiddleware\n\nasync def tool_refund_allowed(candidate):\n    return await within_refund_limit(candidate["args"])\n\ntool_policy = replace(policy, rule=tool_refund_allowed)\ngate = LangChainAdapter().compile_invariant(tool_policy)\nmiddleware = VSLToolMiddleware(\n    gates_by_tool_name={"issue_refund": gate}\n)\n# Pass middleware=[middleware] to your create_agent(...) call.' } },
        { type: 'paragraph', text: 'This wiring snippet adapts the tutorial rule to the tool request’s args field; it is not a complete standalone agent. Match the actual registered tool name and argument schema. Tools absent from the mapping are not gated by this middleware.' },
        { type: 'callout', tone: 'warning', title: 'Target the supported LangChain API', text: 'The adapter targets create_agent and its tool-call middleware, not the deprecated AgentExecutor or initialize_agent APIs. The upstream README describes hook-level integration tests and notes the full live agent loop has not been tested there.' },
      ] },
      { id: 'microsoft-agent-framework', title: 'Microsoft Agent Framework: fail closed', blocks: [
        { type: 'code', sample: { label: 'Install', language: 'bash', code: 'python -m pip install vsl-maf' } },
        { type: 'code', sample: { label: 'Prepare function middleware', language: 'python', code: 'from first_gate import policy\nfrom vsl_maf import MAFAdapter, VSLFunctionMiddleware, tool_arguments\n\ngate = MAFAdapter(identity_key="refund-agent").compile_invariant(policy)\nmiddleware = VSLFunctionMiddleware(\n    gate,\n    candidate_input_fn=tool_arguments,\n    function_name="issue_refund",\n)\n# Register middleware=[middleware] when constructing your Agent.' } },
        { type: 'paragraph', text: 'The default abort mode raises VSLGateDenied to the caller of agent.run rather than quietly returning a tool error. A model connector and its credentials are separate requirements. Register argument-repair middleware before the governance middleware.' },
      ] },
      { id: 'offline-starter', title: 'Start from a complete offline agent', blocks: [
        { type: 'paragraph', text: 'The Python LangGraph starter implements ownership, refundable-amount, budget-headroom, and recipient gates. It runs seven scripted requests, records decisions, and includes a human-authorised re-enablement flow.' },
        { type: 'code', sample: { label: 'With an activated environment', language: 'bash', code: 'git clone https://github.com/supersemantics/supersemantics-VSL-Starters.git\ncd supersemantics-VSL-Starters\ncd langgraph-python\npython -m pip install -e ".[dev]"\npython -m refund_agent\npython -m pytest' } },
        { type: 'links', items: [
          { title: 'LangGraph Python starter', description: 'A complete offline refund agent and gate tests.', href: `${starters}/tree/main/langgraph-python` },
          { title: 'Microsoft Agent Framework Python starter', description: 'The same domain with per-tool middleware.', href: `${starters}/tree/main/maf-python` },
        ] },
      ] },
    ],
    sources: [{ title: 'LangGraph adapter and documentation', href: 'https://github.com/supersemantics/VSL-Langgraph' }, { title: 'LangChain adapter README', href: 'https://github.com/supersemantics/VSL-LangChain' }, { title: 'Microsoft Agent Framework adapter README', href: 'https://github.com/supersemantics/VSL-Microsoft-agent-framework' }, { title: 'Offline Python starter', href: `${starters}/tree/main/langgraph-python` }],
  },
  {
    slug: 'reference', title: 'Reference & troubleshooting',
    description: 'A compact map of the Python APIs used in this guide, with the responsibilities and common pitfalls that matter when you build.',
    group: 'Reference', eyebrow: 'KEEP THIS NEAR YOUR EDITOR',
    sections: [
      { id: 'api-map', title: 'Core API map', blocks: [
        { type: 'table', headers: ['Import', 'Responsibility'], rows: [
          ['vsl_core.constructs.Invariant', 'Named hard rule; async rule(candidate) returns bool.'],
          ['vsl_core.constructs.PreNode', 'Measured prerequisite; async monitor(candidate) returns GammaEstimate.'],
          ['vsl_core.metrics.AssuranceBasis', 'Strictly typed declaration of F1 and F2 facts; derives the assurance level.'],
          ['vsl_core.metrics.GammaEstimate', 'Your measured ratio, estimation error, and strict sufficient() comparison.'],
          ['vsl_core.constructs.TerminalState', 'Names the state your application must explicitly halt and recover from.'],
          ['vsl_core.ledger.VerbaLedger', 'Records decisions and events, verifies the chain, and audits recorded lifecycle relationships.'],
          ['vsl_core.ledger.JsonlLedgerStore', 'Local append-only persistence for the Python ledger.'],
          ['vsl_core.conformance.reference_adapter.PlainPythonReferenceAdapter', 'Direct-call teaching/reference adapter for compiling the two primitives.'],
        ] },
      ] },
      { id: 'common-errors', title: 'Common mistakes', blocks: [
        { type: 'table', headers: ['Symptom', 'What to check'], rows: [
          ['ModuleNotFoundError: vsl_core', 'Use the same Python environment for pip and execution; install super-semantics-vsl.'],
          ['FrozenInstanceError setting assurance_level', 'Set AssuranceBasis at construction; the assurance level is derived and read-only.'],
          ['A Gamma value of 1.1 is denied', 'The default comparison is strictly greater than 1.1, not greater-than-or-equal.'],
          ['A gate raised but the ledger is empty', 'Adapters do not automatically write your application’s gate records.'],
          ['No actual halt after InvariantViolation', 'Catch and handle the terminal path explicitly; a named TerminalState is not a running state machine.'],
          ['An intact chain has a failed audit', 'Inspect real missing lifecycle and causal records, not just record hashes.'],
          ['The catalog did not scan a repository', 'The catalog is data and heuristics. X-Verba CLI is the separate scanner.'],
        ] },
      ] },
      { id: 'terminal-recovery', title: 'Terminal states and recovery', blocks: [
        { type: 'paragraph', text: 'Invariant.on_violation can name a TerminalState, and InvariantViolation exposes terminal_state_name. Your code must record the event and prevent further automated effects. Do not parse a free-text reason to discover the terminal state.' },
        { type: 'paragraph', text: 'For identity-based recovery, use the documented request_re_enablement flow with GovernanceAuthority and Evidence, not the private Instance._re_enable mechanism. Review the upstream guide for the full lifecycle and its required ledger records.' },
      ] },
      { id: 'source-of-truth', title: 'Follow the source of truth', blocks: [
        { type: 'links', items: [
          { title: 'Exact primitives and canonical patterns', description: 'Upstream machine-readable API facts and executed examples.', href: `${coreDocs}/vsl-core-primitives.json` },
          { title: 'Building with VSL-Core', description: 'The canonical construct, compile, call, log, and escalate method.', href: `${coreDocs}/building-with-vsl-core.md` },
          { title: 'Troubleshooting', description: 'Reproduced exceptions and explanations from the project.', href: `${coreDocs}/troubleshooting.md` },
          { title: 'Governance frameworks', description: 'Scope and caveats for compliance-related interpretation.', href: `${coreDocs}/governance-frameworks.md` },
        ] },
        { type: 'callout', tone: 'note', title: 'Keep documentation aligned with your release', text: 'These are curated learning guides, not an exhaustive generated API specification. The projects are evolving. Check upstream source, changelogs, and adapter requirements when changing dependency versions.' },
      ] },
    ],
    sources: [{ title: 'VSL-Core source', href: core }, { title: 'Upstream troubleshooting', href: `${coreDocs}/troubleshooting.md` }, { title: 'Human-authorised recovery API', href: `${core}/blob/main/src/vsl_core/governance.py` }],
  },
]

export const docGroups = [...new Set(docPages.map(page => page.group))]

function blockText(block: DocBlock): string {
  switch (block.type) {
    case 'paragraph': return block.text
    case 'list': return block.items.join(' ')
    case 'code': return block.sample.code
    case 'code-group': return block.samples.map(sample => sample.code).join(' ')
    case 'callout': return `${block.title} ${block.text}`
    case 'table': return `${block.headers.join(' ')} ${block.rows.flat().join(' ')}`
    case 'links': return block.items.map(item => `${item.title} ${item.description}`).join(' ')
  }
}

export function buildSearchIndex(pages: DocPage[], track: 'python' | 'typescript' = 'python') {
  return pages.flatMap(page => page.sections.map(section => ({
    title: page.title,
    section: section.title,
    href: `${docHref(page.slug, track)}#${section.id}`,
    description: page.description,
    text: `${page.title} ${page.description} ${section.title} ${section.blocks.map(blockText).join(' ')}`.toLowerCase(),
  })))
}

export const docSearchIndex = buildSearchIndex(docPages)
