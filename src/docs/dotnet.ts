import project from './examples/dotnet/VslGuide.csproj?raw'
import program from './examples/dotnet/Program.cs?raw'
import refund from './examples/dotnet/RefundPolicy.cs?raw'
import threshold from './examples/dotnet/ThresholdPolicy.cs?raw'
import ledger from './examples/dotnet/LedgerEvidence.cs?raw'
import checks from './examples/dotnet/GateChecks.cs?raw'
import { docHref } from './content'
import type { DocPage } from './content'

const core = 'https://github.com/supersemantics/VSL-Core.NET'
const coreSource = `${core}/blob/b27d7a7ea2183a5239aec12a57d113ccccdf4019`
const source = `${coreSource}/src/SuperSemantics.Vsl`
const adapter = 'https://github.com/supersemantics/VSL-Microsoft-agent-framework.NET'
const adapterSource = `${adapter}/blob/ff554ae19b685445f8561927823ba13a58ad1537`
const href = (slug: string) => docHref(slug, 'dotnet')

export const dotnetPages: DocPage[] = [
  {
    slug: 'introduction', title: 'C# actions. Explicit boundaries.',
    description: 'Build pre-action governance with VSL-Core.NET, then connect it to Microsoft Agent Framework. Native C#, no Python runtime required.',
    group: 'Get started', eyebrow: 'C# & .NET / START HERE',
    sections: [
      { id: 'what-you-will-build', title: 'Govern before the side effect', blocks: [
        { type: 'paragraph', text: 'Start with an integer refund cap, await its compiled gate immediately before the action, and prove that denied requests never execute. Add a budget-headroom monitor, persistent decision evidence, and executable checks without a model API key or agent framework.' },
        { type: 'table', headers: ['Repository / package', 'Responsibility'], rows: [
          ['VSL-Core.NET / SuperSemantics.Vsl', 'Framework-agnostic Invariant, PreNode, GammaEstimate, VerbaLedger, and adapter conformance.'],
          ['VSL-Microsoft-agent-framework.NET / SuperSemantics.Vsl.AgentFramework', 'MafAdapter and explicit UseVslGate / UseVslGates registration before tool calls.'],
          ['Your application', 'Policy, gate placement, identity, side effects, evidence writes, escalation, and recovery.'],
        ] },
        { type: 'callout', tone: 'note', title: '.NET 10 SDK required', text: 'Both repositories target net10.0. Use the .NET 10 SDK, not only the runtime or an older .NET SDK. The core library has no runtime dependencies beyond the .NET base library. These gates run on your trusted server or worker, not inside this website.' },
      ] },
      { id: 'learning-path', title: 'Follow the C# learning path', blocks: [
        { type: 'links', items: [
          { title: '01 / Set up .NET', description: 'Download the console project and restore the core library.', href: href('installation') },
          { title: '02 / Your first gate', description: 'Put an Invariant before a refund callback.', href: href('first-gate') },
          { title: '03 / Rules & thresholds', description: 'Understand strict Gamma and uncertainty allowances.', href: href('thresholds') },
          { title: '04 / Evidence & ledger', description: 'Record a denial and distinguish integrity from audit.', href: href('ledger') },
          { title: '05 / Test the boundary', description: 'Check side effects, failures, persistence, and conformance.', href: href('testing') },
          { title: '06 / Microsoft Agent Framework', description: 'Register tool gates and handle run-level denials.', href: href('integrations') },
        ] },
      ] },
      { id: 'source-scope', title: 'Read the release boundary', blocks: [
        { type: 'paragraph', text: 'These guides were reviewed against core source version 0.1.2 and the linked Agent Framework adapter source, whose project references core 0.1.1 and Microsoft.Agents.AI 1.28.0. Source links are pinned to the reviewed commits. NuGet publication and package installation are not independently verified here; follow your approved package source and validate the versions you deploy.' },
        { type: 'callout', tone: 'tip', title: 'Core examples compiled and executed', text: 'The six-file tutorial was built in Release mode and its boundary, failure, conformance, and persistent-evidence checks passed against the pinned core 0.1.2 source. The configured package mirror did not provide SuperSemantics.Vsl, so this validates the documented source-reference path, not a NuGet installation.' },
        { type: 'callout', tone: 'warning', title: 'Enforcement is not certification', text: 'Installing a package does not intercept actions automatically, prove a policy correct, or establish regulatory compliance. An assurance level is derived from declared F1/F2 facts, not independent proof of those facts.' },
      ] },
    ],
    sources: [{ title: 'VSL-Core.NET overview', href: `${coreSource}/README.md` }, { title: 'Microsoft Agent Framework .NET adapter', href: `${adapterSource}/README.md` }, { title: 'Core version and build settings', href: `${coreSource}/Directory.Build.props` }],
  },
  {
    slug: 'installation', title: 'Set up your .NET environment.',
    description: 'Use an isolated .NET 10 console project. Download the same C# files shown throughout these guides; no website dependency changes or model credentials are needed.',
    group: 'Get started', eyebrow: 'STEP 01 / INSTALLATION',
    sections: [
      { id: 'requirements', title: 'Check the SDK first', blocks: [
        { type: 'code', sample: { label: 'Terminal / PowerShell', language: 'bash', code: 'dotnet --list-sdks\nmkdir VslGuide\ncd VslGuide' } },
        { type: 'paragraph', text: 'Confirm that the SDK list includes 10.x. An installed Microsoft.NETCore.App runtime alone cannot restore, compile, or run this source project. Install an approved .NET 10 SDK if the list is empty; do not change machine-wide settings or bypass organizational package restrictions.' },
      ] },
      { id: 'download-project', title: 'Download the six-file tutorial', blocks: [
        { type: 'paragraph', text: 'Save all six files in the new VslGuide directory before running any lesson. Program.cs dispatches to every lesson, so the complete set must be present even for the first gate. The download buttons preserve the filenames; do not run dotnet new console afterward, because it would replace Program.cs.' },
        { type: 'code', sample: { label: 'VslGuide.csproj', language: 'markup', code: project }, download: new URL('./examples/dotnet/VslGuide.csproj', import.meta.url).href },
        { type: 'code', sample: { label: 'Program.cs', language: 'csharp', code: program }, download: new URL('./examples/dotnet/Program.cs', import.meta.url).href },
        { type: 'links', items: [
          { title: 'RefundPolicy.cs', description: 'Download from the first-gate lesson.', href: `${href('first-gate')}#define-and-run` },
          { title: 'ThresholdPolicy.cs', description: 'Download from the thresholds lesson.', href: `${href('thresholds')}#build-a-monitor` },
          { title: 'LedgerEvidence.cs', description: 'Download from the evidence lesson.', href: `${href('ledger')}#record-the-decision` },
          { title: 'GateChecks.cs', description: 'Download from the testing lesson.', href: `${href('testing')}#run-the-checks` },
        ] },
      ] },
      { id: 'restore-and-run', title: 'Restore, build, and run', blocks: [
        { type: 'code', sample: { label: 'Inside VslGuide', language: 'bash', code: 'dotnet restore\ndotnet build --no-restore\ndotnet run --no-build -- first\ndotnet run --no-build -- threshold\ndotnet run --no-build -- ledger\ndotnet run --no-build -- test' } },
        { type: 'paragraph', text: 'The project pins SuperSemantics.Vsl to 0.1.2, matching the reviewed core manifest. Restore uses your configured NuGet sources. If that version is unavailable, obtain an approved package or build the reviewed source; do not silently substitute an untested release.' },
        { type: 'code', sample: { label: 'Optional approved source reference / PowerShell', language: 'bash', code: 'git clone https://github.com/supersemantics/VSL-Core.NET.git ..\\VSL-Core.NET\ngit -C ..\\VSL-Core.NET checkout --detach b27d7a7ea2183a5239aec12a57d113ccccdf4019\ndotnet remove package SuperSemantics.Vsl\ndotnet add reference ..\\VSL-Core.NET\\src\\SuperSemantics.Vsl\\SuperSemantics.Vsl.csproj\ndotnet run -- test' } },
        { type: 'callout', tone: 'note', title: 'Source builds still need an SDK', text: 'Use the source-reference path only if repository access and builds are approved. Run each command only after the previous one succeeds. The guide project intentionally treats warnings as errors, and its test mode throws on failed checks rather than printing a success-shaped fallback.' },
      ] },
    ],
    sources: [{ title: 'Core target framework and package ID', href: `${source}/SuperSemantics.Vsl.csproj` }, { title: 'Version 0.1.2 build properties', href: `${coreSource}/Directory.Build.props` }, { title: 'Upstream build instructions', href: `${coreSource}/README.md` }],
  },
  {
    slug: 'first-gate', title: 'Your first C# gate.',
    description: 'Enforce a hard refund cap with an Invariant and an awaited CompiledGate. Only an allowed amount reaches the action callback.',
    group: 'Get started', eyebrow: 'STEP 02 / FIRST GATE',
    sections: [
      { id: 'define-and-run', title: 'Define, compile, await, execute', blocks: [
        { type: 'paragraph', text: 'The rule accepts only boxed long values from 0 through 1000 minor units, inclusive. Use the L suffix in these examples: 250L is a long, while a boxed 250 is an int and is deliberately denied. Strings, floating-point values, negative amounts, and null are also denied.' },
        { type: 'code', sample: { label: 'RefundPolicy.cs', language: 'csharp', code: refund }, download: new URL('./examples/dotnet/RefundPolicy.cs', import.meta.url).href },
        { type: 'code', sample: { label: 'Run the complete project from installation', language: 'bash', code: 'dotnet run -- first' } },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: "ISSUED 250\nDENIED: Invariant 'refund-cap' violated (identity_key='conformance-test')" } },
      ] },
      { id: 'gate-contract', title: 'A successful gate returns no decision object', blocks: [
        { type: 'list', items: ['InvariantRule returns Task<bool>. CompileInvariant returns CompiledGate, a delegate from object? to Task; await it before any side effect.', 'A failed Invariant throws InvariantViolationException, which derives from AutomationDeniedException. Handle the intended denial explicitly and let unexpected failures propagate.', 'The callback stands in for a refund provider. The gate does not refund money, add transaction isolation, or protect an action that another code path can invoke without checking.', 'PlainReferenceAdapter is a teaching implementation. Its denial identity is conformance-test, not a production agent identity.', 'An Invariant can name an OnViolation TerminalState, but the reference adapter only includes that name in its exception. Your application must own terminal-state entry, persistence, escalation, and recovery.'] },
        { type: 'callout', tone: 'warning', title: 'A blocking cap is still Low assurance', text: 'This example declares F1=true and F2Modification.None: the check precedes the action but changes nothing about a model’s output. Its derived level is Low. That does not weaken its blocking behavior, and it is not a reason to claim Full or High.' },
      ] },
    ],
    sources: [{ title: 'Invariant, rules, and TerminalState', href: `${source}/Constructs.cs` }, { title: 'CompiledGate and reference adapter', href: `${source}/Conformance/Conformance.cs` }, { title: 'Exception hierarchy', href: `${source}/Exceptions.cs` }],
  },
  {
    slug: 'thresholds', title: 'Measured headroom. Strict thresholds.',
    description: 'Use a PreNode for a meaningful monitor estimate. Understand why equality at the robust Gamma threshold is a denial.',
    group: 'Build & verify', eyebrow: 'STEP 03 / ROBUST GAMMA',
    sections: [
      { id: 'strict-boundary', title: 'GammaHat must strictly exceed the bar', blocks: [
        { type: 'paragraph', text: 'GammaEstimate.Sufficient(threshold) checks GammaHat > max(threshold, 1 + DeltaEstimationError). Thresholds.RobustGammaDefault is 1.1; RobustGammaHighStakes is 1.2. The default bar already includes a 10% allowance. A larger declared uncertainty raises it further, rather than multiplying the allowance twice.' },
        { type: 'table', headers: ['GammaHat', 'Error allowance', 'Threshold', 'Outcome'], rows: [
          ['1.10', '0.10', '1.10', 'Denied: equality does not pass.'],
          ['1.11', '0.10', '1.10', 'Allowed: strictly above 1.10.'],
          ['1.20', '0.20', '1.10', 'Denied: uncertainty raises the required value to 1.20.'],
          ['1.25', '0.20', '1.10', 'Allowed: strictly above 1.20.'],
        ] },
      ] },
      { id: 'build-a-monitor', title: 'Compute a defensible ratio', blocks: [
        { type: 'paragraph', text: 'The example uses 1000 available minor units divided by the requested amount; 1.0 is break-even. This transparent policy proxy is not a measured model-governance strength. Invalid or non-positive inputs yield a denying estimate, and the gate surfaces that denial as AutomationDeniedException.' },
        { type: 'code', sample: { label: 'ThresholdPolicy.cs', language: 'csharp', code: threshold }, download: new URL('./examples/dotnet/ThresholdPolicy.cs', import.meta.url).href },
        { type: 'code', sample: { label: 'Run the threshold lesson', language: 'bash', code: 'dotnet run -- threshold' } },
        { type: 'code', sample: { label: 'Expected output', language: 'text', code: 'ALLOWED: 1000 / 800 = 1.25 > 1.1\nExact threshold passes: False' } },
        { type: 'callout', tone: 'warning', title: 'Do not reuse unrelated scores', text: 'A raw confidence in [0, 1], a confidence supplied by the model itself, or a static scanner’s Gamma score is not this runtime ratio. Use an Invariant for a hard business rule. The 1.1 threshold here is instructional; upstream recommends RobustGammaHighStakes for payments and other high-stakes actions.' },
      ] },
    ],
    sources: [{ title: 'GammaEstimate and threshold formulas', href: `${source}/Metrics.cs` }, { title: 'PreNode monitor contract', href: `${source}/Constructs.cs` }, { title: 'Reference adapter comparison', href: `${source}/Conformance/Conformance.cs` }],
  },
  {
    slug: 'ledger', title: 'Record the decision you made.',
    description: 'Write actual gate outcomes to a persistent JSONL ledger. An intact hash chain and a complete governance lifecycle are different checks.',
    group: 'Build & verify', eyebrow: 'STEP 04 / EVIDENCE & LEDGER',
    sections: [
      { id: 'record-the-decision', title: 'Persist a real denial', blocks: [
        { type: 'paragraph', text: 'Compiled gates do not write evidence automatically. This example catches the actual InvariantViolationException, records allowed=false, and reopens the file to inspect it. It deliberately leaves the denial unresolved; no refund or invented recovery event is written.' },
        { type: 'code', sample: { label: 'LedgerEvidence.cs', language: 'csharp', code: ledger }, download: new URL('./examples/dotnet/LedgerEvidence.cs', import.meta.url).href },
        { type: 'code', sample: { label: 'Run the evidence lesson', language: 'bash', code: 'dotnet run -- ledger' } },
        { type: 'paragraph', text: 'The program appends to dotnet-decisions.jsonl in the working directory. On a fresh file, expect the denial message, Integrity: True, and Lifecycle complete: False. Re-running appends another decision. Required storage failures propagate; do not continue an irreversible action after a required evidence write fails.' },
      ] },
      { id: 'integrity-and-audit', title: 'Ask the right evidence question', blocks: [
        { type: 'table', headers: ['API', 'Meaning'], rows: [
          ['ledger.WriteGateDecision(...)', 'For an Invariant, pass the observed allowed boolean. For a PreNode, pass the exact estimate and threshold used by that gate. primitiveName must match the declared gate name.'],
          ['ledger.VerifyIntegrity()', 'Recomputes hashes and links. Internal consistency does not prove external truth or detect truncation to an older consistent chain.'],
          ['ledger.Audit().AllPassed', 'Checks the recorded governance lifecycle, not legal compliance or action safety. Set maxMonitorGapSeconds when checking monitoring gaps; null skips that check.'],
          ['ledger.CurrentCheckpoint()', 'Returns the chain tip for independent external witnessing.'],
          ['ledger.IssueCertificate()', 'Returns null if audit fails. A returned certificate concerns the recorded governance process, not the underlying system.'],
        ] },
        { type: 'list', ordered: true, items: ['A drift-flagged Monitor needs a linked PreNode intervention record.', 'A PreNode record needs a linked Verification of what actually happened.', 'An Insufficient verification needs a SpecificationUpdate; a Terminal record needs a HumanAuthorisedTransition for its audit requirement.', 'Use decisionId to group records and causedBy to link the exact prior EntryId. Concurrent decisions must not rely on identity and timestamp matching alone. Never fabricate recovery or authorization to make an audit pass.'] },
      ] },
      { id: 'storage-compatibility', title: '.NET and Python storage compatibility', blocks: [
        { type: 'paragraph', text: 'Unlike the TS/JS JSONL store, the .NET JsonlLedgerStore uses a sibling .lock file for cross-process append coordination, compatible with the Python store. Upstream tests pin canonical JSON and hashes to Python output. Use fsync: true for durable writes and validate the shared-filesystem locking behavior of your deployment.' },
        { type: 'callout', tone: 'note', title: 'Ledger APIs are synchronous', text: 'WriteGateDecision, VerifyIntegrity, Audit, and CurrentCheckpoint do not return Tasks. Only the gates in this lesson are awaited. Ledger payloads distinguish integer 2 from double 2.0, and decimal values are rejected. Use long minor units, a supported double, or a string without silently losing precision.' },
      ] },
    ],
    sources: [{ title: 'Ledger writes and audit implementation', href: `${source}/Ledger/VerbaLedger.cs` }, { title: 'JSONL locking and fsync', href: `${source}/Ledger/Stores.cs` }, { title: 'Python compatibility and payload restrictions', href: `${coreSource}/README.md` }],
  },
  {
    slug: 'testing', title: 'Prove denied actions never run.',
    description: 'Run release-mode checks for allow/deny ordering, invalid inputs, error propagation, strict thresholds, adapter conformance, and persistent evidence.',
    group: 'Build & verify', eyebrow: 'STEP 05 / TESTING',
    sections: [
      { id: 'run-the-checks', title: 'Run the complete tutorial checks', blocks: [
        { type: 'paragraph', text: 'Save GateChecks.cs beside the other five tutorial files. These checks are a small console harness, not a separate test-framework project: failures throw, produce a nonzero process exit, and remain active in Release builds. Run the test command below rather than dotnet test for this tutorial.' },
        { type: 'code', sample: { label: 'GateChecks.cs', language: 'csharp', code: checks }, download: new URL('./examples/dotnet/GateChecks.cs', import.meta.url).href },
        { type: 'code', sample: { label: 'Run the checks', language: 'bash', code: 'dotnet run --configuration Release -- test' } },
        { type: 'list', items: ['Allowed refund values, including 0 and 1000, reach the callback exactly once; over-limit and negative refunds never do.', 'Malformed candidates are denied, and a passing gate remains reusable after a denial.', 'Payment-provider and monitor failures propagate instead of being mistaken for success or a business denial.', 'Threshold equality denies; the uncertainty allowance is not counted twice.', 'The reference adapter returns no conformance failures.', 'The JSONL record survives reopening with valid integrity, but the unresolved denial fails the lifecycle audit. Temporary test ledger and lock files are removed.'] },
      ] },
      { id: 'adapter-conformance', title: 'Check your own adapter too', blocks: [
        { type: 'code', sample: { label: 'Inside an async C# method', language: 'csharp', code: 'var failures = await ConformanceSuite.RunAsync(new PlainReferenceAdapter());\nif (failures.Count != 0)\n{\n    throw new InvalidOperationException(string.Join(Environment.NewLine, failures));\n}' } },
        { type: 'paragraph', text: 'Import SuperSemantics.Vsl.Conformance. For a framework adapter, pass its IVslAdapter implementation instead. An empty failure list checks the gate contract, including side-effect ordering and reuse; it does not prove your production policy or tool wiring is correct. Add application-level tests for every irreversible action path.' },
      ] },
    ],
    sources: [{ title: 'Conformance suite and IVslAdapter', href: `${source}/Conformance/Conformance.cs` }, { title: 'Upstream core tests', href: `${core}/tree/b27d7a7ea2183a5239aec12a57d113ccccdf4019/tests` }],
  },
  {
    slug: 'integrations', title: 'Gate Microsoft Agent Framework tools.',
    description: 'Use the separate .NET adapter, register gates explicitly, and catch run-level denials. This is not the Python Microsoft Agent Framework package.',
    group: 'Go further', eyebrow: 'STEP 06 / FRAMEWORK INTEGRATION',
    sections: [
      { id: 'adapter-installation', title: 'Choose the .NET adapter', blocks: [
        { type: 'code', sample: { label: 'In a separate Agent Framework project', language: 'bash', code: 'dotnet add package SuperSemantics.Vsl.AgentFramework' } },
        { type: 'paragraph', text: 'The reviewed adapter project targets .NET 10, references Microsoft.Agents.AI 1.28.0, and builds against a core 0.1.1 submodule. Its package declares the core dependency for consumers. Confirm availability through approved NuGet sources, pin the resolved package version, and validate your lockfile before deployment. This integration is separate from the core-only VslGuide project.' },
        { type: 'links', items: [{ title: 'Run the upstream offline PurchaseApproval example', description: 'A scripted chat client exercises real Agent Framework calls without a model API key.', href: `${adapter}/tree/ff554ae19b685445f8561927823ba13a58ad1537/examples/PurchaseApproval` }] },
        { type: 'code', sample: { label: 'Approved source build / PowerShell', language: 'bash', code: 'git clone --recurse-submodules https://github.com/supersemantics/VSL-Microsoft-agent-framework.NET.git\ncd VSL-Microsoft-agent-framework.NET\ngit checkout --detach ff554ae19b685445f8561927823ba13a58ad1537\ngit submodule update --init\ndotnet test\ndotnet run --project examples\\PurchaseApproval' } },
      ] },
      { id: 'register-the-gate', title: 'Register before the tool executes', blocks: [
        { type: 'paragraph', text: 'The following wiring method accepts your configured IChatClient; it is not a complete provider setup. VslToolArguments converts JSON arguments to plain values. GetDouble returns 0 for missing or unreadable values, so this positive-amount rule explicitly denies that sentinel. Record the observed rule result before returning it; storage errors must not be treated as permission.' },
        { type: 'code', sample: { label: 'Agent wiring / C#', language: 'csharp', code: `using Microsoft.Agents.AI;
using Microsoft.Extensions.AI;
using SuperSemantics.Vsl;
using SuperSemantics.Vsl.AgentFramework;

static AIAgent BuildRefundAgent(IChatClient model, VerbaLedger ledger)
{
    const string gateName = "refund-tool-cap";
    var gate = new MafAdapter("refund-agent").CompileInvariant(new Invariant(
        name: gateName,
        description: "Positive integer refunds up to 1000 minor units.",
        rule: candidate =>
        {
            var amount = candidate is IReadOnlyDictionary<string, object?> arguments
                ? VslToolArguments.GetDouble(arguments, "amount")
                : 0.0;
            var allowed = double.IsFinite(amount) && amount > 0
                && amount <= 1000 && amount == Math.Truncate(amount);
            ledger.WriteGateDecision("refund-agent", gateName, allowed: allowed);
            return Task.FromResult(allowed);
        },
        assuranceBasis: new AssuranceBasis(true, F2Modification.None)));

    var refund = AIFunctionFactory.Create(
        (double amount) => $"SIMULATED refund: {amount}",
        "issue_refund");
    return new ChatClientAgent(model,
            instructions: "Use issue_refund for refund requests.", tools: [refund])
        .AsBuilder()
        .UseVslGate(gate, functionName: "issue_refund")
        .Build();
}` } },
        { type: 'code', sample: { label: 'Handle the run outcome / C#', language: 'csharp', code: `try
{
    await agent.RunAsync("Refund 1200 minor units");
}
catch (VslGateDeniedException denied)
{
    Console.Error.WriteLine($"Denied {denied.FunctionName}: {denied.Denial.Reason}");
    // Record the actual escalation and route to your human-review workflow.
}
catch (VslGateFailedException failed)
{
    Console.Error.WriteLine($"Gate failed for {failed.FunctionName}: {failed.InnerException}");
    throw;
}` } },
        { type: 'paragraph', text: 'Here agent is the result of BuildRefundAgent(yourConfiguredChatClient, yourLedger). The simulated tool performs no payment. The ledger parameter and provider are application-owned. This abbreviated wiring omits decisionId correlation; add request-scoped decision IDs and causedBy links before using concurrent decisions or recording recovery.' },
      ] },
      { id: 'denial-and-ordering', title: 'Understand run-level denial and ordering', blocks: [
        { type: 'list', items: ['The default VslDenialMode.Abort blocks the denied tool, terminates the remaining tool batch, and throws VslGateDeniedException from the run wrapper. For streaming, the exception is raised when stream enumeration ends.', 'Unexpected gate or monitor errors surface as VslGateFailedException in Abort mode. Cancellation follows its own exception path. Do not catch either failure and continue an unguarded action.', 'ReturnToModel still blocks that tool, but allows the framework to return a tool error and continue the run without notifying your caller of the denial. Choose it only as an explicit behavior change.', 'UseVslGates([capGate, budgetGate], functionName: "issue_refund") executes in listed order and stops at the first denial. Separate UseVslGate registrations execute later-registered middleware first in the tested framework version.', 'Argument-changing middleware needs careful ordering: gates must inspect the values the tool actually receives. Follow the adapter’s registration guidance and test your exact middleware stack.', 'The adapter does not write evidence, implement Fallback retries, or complete terminal recovery. Non-default Fallback settings produce a warning, not a retry loop.'] },
        { type: 'callout', tone: 'warning', title: 'Version-specific integration, not automatic interception', text: 'Only explicitly registered matching tool calls are gated. Test other tools, batched and streaming runs, argument transformations, and all denial paths against your resolved framework version. The provider wiring shown here was source-reviewed, not executed as a live model integration.' },
      ] },
    ],
    sources: [{ title: 'Adapter overview and denial semantics', href: `${adapterSource}/README.md` }, { title: 'MafAdapter and fallback warnings', href: `${adapterSource}/src/SuperSemantics.Vsl.AgentFramework/MafAdapter.cs` }, { title: 'Builder extensions and argument conversion', href: `${adapterSource}/src/SuperSemantics.Vsl.AgentFramework/VslAgentBuilderExtensions.cs` }, { title: 'Pinned framework and core references', href: `${adapterSource}/src/SuperSemantics.Vsl.AgentFramework/SuperSemantics.Vsl.AgentFramework.csproj` }],
  },
  {
    slug: 'reference', title: '.NET API & troubleshooting.',
    description: 'Find the right namespace, exception, and runtime contract. Resolve common setup and integration mistakes without confusing the Python and .NET ports.',
    group: 'Go further', eyebrow: 'REFERENCE / C# & .NET',
    sections: [
      { id: 'api-map', title: 'The core API map', blocks: [
        { type: 'table', headers: ['Namespace / API', 'Contract'], rows: [
          ['SuperSemantics.Vsl / Invariant, PreNode', 'A hard boolean rule or monitored prerequisite with an explicit AssuranceBasis.'],
          ['SuperSemantics.Vsl.Conformance / PlainReferenceAdapter', 'CompileInvariant and CompilePreNode return CompiledGate delegates.'],
          ['GammaEstimate.Sufficient(threshold)', 'Strict comparison: GammaHat > max(threshold, 1 + DeltaEstimationError).'],
          ['InvariantViolationException', 'Specific failed-rule exception; derives from AutomationDeniedException.'],
          ['VerbaLedger / JsonlLedgerStore', 'Synchronous evidence methods; JSONL appends support Python-compatible cross-process locking.'],
          ['ConformanceSuite.RunAsync(adapter)', 'Await a list of failures; an empty list means the adapter passed the suite.'],
          ['SuperSemantics.Vsl.AgentFramework / MafAdapter', 'Framework adapter with the configured identity on denials.'],
          ['UseVslGate / UseVslGates', 'Explicit builder registration; default Abort mode surfaces run-level failure.'],
        ] },
      ] },
      { id: 'troubleshooting', title: 'Diagnose the boundary, not just the symptom', blocks: [
        { type: 'table', headers: ['Symptom', 'Check'], rows: [
          ['No SDKs found / net10.0 not supported', 'Install an approved .NET 10 SDK. A .NET runtime alone is insufficient.'],
          ['NuGet package cannot be restored', 'Check configured approved sources and exact version availability. Registry publication was not independently verified; request an approved artifact or reviewed source build.'],
          ['Program.cs cannot resolve VslGuide classes', 'Download all six tutorial files into the same project directory before building.'],
          ['RefundPolicy.Gate(250) denies', 'The tutorial deliberately accepts long: call with 250L, not a boxed int, string, or double.'],
          ['Gamma exactly 1.1 denies', 'Equality fails. The required value must be strictly exceeded, including any larger uncertainty allowance.'],
          ['A denial is missing from the ledger', 'Gates and adapters never write automatically; record actual decisions in your application.'],
          ['VerifyIntegrity is true but Audit fails', 'The hash chain is intact but the recorded lifecycle may be unresolved. Inspect ChecksFailed and Violations.'],
          ['A run continued after a tool error', 'Use the default Abort mode and catch VslGateDeniedException. ReturnToModel deliberately continues the run.'],
          ['Gate execution order looks reversed', 'Use UseVslGates for a listed chain; separate registrations follow framework middleware composition.'],
          ['A decimal ledger payload is rejected', 'Use long minor units or another supported representation. Do not silently cast away precision.'],
        ] },
      ] },
      { id: 'production-checklist', title: 'Before production', blocks: [
        { type: 'list', items: ['Keep runtime gating on the trusted side of the action. Validate inputs and prevent alternate ungated action paths.', 'Pin and test the core, adapter, and Microsoft framework versions together. Keep the .NET and Python package names distinct.', 'Record real decisions and causal recovery, and preserve required evidence failures as application failures.', 'Use durable storage, external checkpoints, retention and access controls appropriate to your deployment.', 'Report F1 enforcement separately from the self-declared F2-derived assurance level. Conformance, hashes, and certificates do not establish independently verified compliance.'] },
      ] },
    ],
    sources: [{ title: 'Core public constructs', href: `${source}/Constructs.cs` }, { title: 'Gamma and assurance contracts', href: `${source}/Metrics.cs` }, { title: 'Ledger implementation', href: `${source}/Ledger/VerbaLedger.cs` }, { title: 'Agent Framework adapter', href: `${adapterSource}/README.md` }],
  },
]
