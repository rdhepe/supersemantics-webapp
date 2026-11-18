using SuperSemantics.Vsl;
using SuperSemantics.Vsl.Conformance;

namespace VslGuide;

public static class RefundPolicy
{
    public const string Name = "refund-cap";

    public static readonly CompiledGate Gate = new PlainReferenceAdapter().CompileInvariant(
        new Invariant(
            name: Name,
            description: "Refunds must be integer minor units between 0 and 1000.",
            rule: candidate => Task.FromResult(candidate is long amount and >= 0 and <= 1000),
            assuranceBasis: new AssuranceBasis(true, F2Modification.None)));

    public static async Task ExecuteAsync(long amount, Func<long, Task> issueRefund)
    {
        await Gate(amount);
        await issueRefund(amount);
    }
}
