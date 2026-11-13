export const links = {
  scan: 'https://scan.supersemantics.org/',
  github: 'https://github.com/supersemantics',
  research:
    'https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Balasubramanian%2C%20Vishwanathprasad%22&l=list&p=1&s=10&sort=bestmatch',
  email: 'mailto:hello@supersemantics.org',
}

export const navigation = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Research', href: '#research' },
  { label: 'About', href: '#about' },
]

export const stages = [
  {
    name: 'Define',
    label: 'Formation layer',
    title: 'Make the rules executable.',
    description:
      'Before an agent acts, define what it is allowed to do. Turn invariants, constraints, terminal states, and approval conditions into machine-readable governance.',
    features: [
      'VSL specifications',
      'Invariants & constraints',
      'Human-authorised transitions',
      'Consequential-action coverage',
    ],
    principle: 'Where “supposed to” becomes executable.',
    file: 'governance.vsl',
    code: [
      ['spec', 'consequential_action'],
      ['invariant', 'within_authorised_scope'],
      ['constraint', 'approval_before_commit'],
      ['transition', 'human_authorised'],
      ['terminal', 'halt_on_boundary'],
    ],
    status: 'Specification defined',
  },
  {
    name: 'Act + Check',
    label: 'Runtime governance',
    title: 'A boundary before consequence.',
    description:
      'Every consequential action is evaluated against the active rules. The X-VERBA Policy Engine returns a verdict before the action proceeds. You keep control of the flow.',
    features: [
      'Pre-action policy evaluation',
      'Permit, deny, or escalate',
      'Human authority when required',
      'Explicit execution boundaries',
    ],
    principle: 'Intelligence stops being its own authority.',
    file: 'runtime.evaluate',
    code: [
      ['request', 'agent.proposed_action'],
      ['load', 'active_specification'],
      ['evaluate', 'constraints + authority'],
      ['verdict', 'permit | deny | escalate'],
      ['resolve', 'execute_or_halt'],
    ],
    status: 'Action evaluated',
  },
  {
    name: 'Prove',
    label: 'Verba Ledger',
    title: 'Evidence. Not just a promise.',
    description:
      'Preserve the governance record across the lifecycle of an action: the specification, request, policy verdict, human intervention, outcome, and causal history.',
    features: [
      'Tamper-evident records',
      'Hash-chained & causally linked',
      'Decision & approval history',
      'Exportable governance evidence',
    ],
    principle: 'Show what was checked, authorised, and resolved.',
    file: 'verba.ledger',
    code: [
      ['specification', 'version + constraints'],
      ['decision', 'request + policy_verdict'],
      ['authority', 'human_approval_record'],
      ['outcome', 'execution_trace'],
      ['evidence', 'hash_chained_history'],
    ],
    status: 'Evidence preserved',
  },
] as const

export const useCases = [
  {
    name: 'Conversational agents',
    fullName: 'Customer-facing & conversational agents',
    short: 'Every interaction has a boundary.',
    challenge:
      'Consent, scope, identity, and permitted actions can change during an interaction. The conditions that first authorised a conversation may no longer authorise its next action.',
    application:
      'VSL-Core defines the constraints and authority boundaries. VSL-Agentic framework adapters connect those controls to the workflow, so consequential tool calls and external actions can be evaluated before execution.',
    tags: ['Customer service', 'Claims', 'Public services', 'Advisory'],
    flow: ['Agent request', 'Consent + scope', 'Policy verdict', 'Governed action'],
  },
  {
    name: 'High-stakes transactions',
    fullName: 'Transactional & high-stakes agents',
    short: 'Check the limits. Before commitment.',
    challenge:
      'An uncertain AI decision can become a payment, trade, purchase, or approval before the necessary limits, evidence, and authority have been checked.',
    application:
      'VSL-Core expresses limits and approval conditions as machine-readable governance. Framework adapters place those controls in the execution path. X-VERBA can permit, deny, retry, escalate, require human authority, or stop autonomous continuation.',
    tags: ['Financial services', 'Insurance', 'Healthcare', 'Procurement'],
    flow: ['Proposed transaction', 'Limits + authority', 'Policy verdict', 'Commit or halt'],
  },
  {
    name: 'Multi-agent systems',
    fullName: 'Multi-agent & enterprise automation',
    short: 'Correct alone. Governed together.',
    challenge:
      'One agent’s locally valid action can combine with another agent’s action to create a prohibited system-level outcome. Each can be correct alone. The combination may not be.',
    application:
      'Define individual and system-level boundaries with VSL-Core, then connect controls across agent runtimes and hand-offs. X-VERBA evaluates consequential transitions while the Verba Ledger preserves decisions and causal relationships.',
    tags: ['Enterprise automation', 'Cross-system workflows', 'Agent hand-offs'],
    flow: ['Agent hand-off', 'System constraints', 'Policy verdict', 'Linked evidence'],
  },
  {
    name: 'AI-native development',
    fullName: 'AI-native software development',
    short: 'Keep intent intact as code evolves.',
    challenge:
      'Prompt history is not a durable agreement. Repeated AI-generated changes can move implementation, tests, and architecture away from what humans agreed to build.',
    application:
      'A versioned VSL-Development Contract remains the independent, machine-readable reference point. Evaluate generated changes against that contract so requirements, constraints, and authority boundaries stay explicit across generations.',
    tags: ['AI-native development', 'Autonomous refactoring', 'Generated code'],
    flow: ['Generated change', 'VSL contract', 'Contract evaluation', 'Reviewed transition'],
  },
  {
    name: 'Physical autonomy',
    fullName: 'Robotics & physical autonomy',
    short: 'Govern the moment before movement.',
    challenge:
      'A probabilistic decision can become a physical action before operating conditions, authority boundaries, or required approvals have been checked.',
    application:
      'Place the governance boundary before actuation. Evaluate proposed transitions against declared constraints, operating conditions, and authority before commands proceed, and preserve the decision and outcome as evidence.',
    tags: ['Robotics', 'Logistics', 'Industrial systems', 'Infrastructure'],
    flow: ['Proposed command', 'Operating conditions', 'Authority check', 'Actuate or halt'],
  },
  {
    name: 'GRC platforms',
    fullName: 'GRC & governance platforms',
    short: 'Connect policy to what actually happens.',
    challenge:
      'Governance requirements often remain in policies and dashboards while runtime enforcement and technical evidence stay disconnected from governance processes.',
    application:
      'Embed X-VERBA into existing workflows: the Scan API surfaces decision points and governance gaps; the Policy Engine API evaluates actions; the Ledger API preserves verdicts, approvals, action traces, and evidence.',
    tags: ['Assurance', 'Governance dashboards', 'Enterprise risk', 'API integration'],
    flow: ['Scan API', 'Governance gaps', 'Policy Engine API', 'Ledger API'],
  },
] as const

export const research = [
  {
    title: 'Constraint-driven behaviour',
    description: 'How explicit constraints shape, bound, and direct autonomous behaviour.',
  },
  {
    title: 'System dynamics',
    description: 'Understanding transition, convergence, and deviation before systems stabilise.',
  },
  {
    title: 'Signals & drift',
    description: 'Observable signals of behavioural change, instability, and departure from intent.',
  },
  {
    title: 'Computable governance',
    description: 'Specifications that software can evaluate, enforce, and evidence.',
  },
] as const
