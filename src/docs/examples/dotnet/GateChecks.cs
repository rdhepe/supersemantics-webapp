using SuperSemantics.Vsl;
using SuperSemantics.Vsl.Conformance;

namespace VslGuide;

public static class GateChecks
{
    public static async Task RunAsync()
    {
        var issued = new List<long>();
        foreach (var amount in new long[] { 0, 250, 1000 })
        {
            await RefundPolicy.ExecuteAsync(amount, value =>
            {
                issued.Add(value);
                return Task.CompletedTask;
            });
        }
        Check(issued.SequenceEqual(new long[] { 0, 250, 1000 }), "Allowed refunds must execute once.");

        foreach (var amount in new long[] { -1, 1001 })
        {
            await ExpectDeniedAsync(() => RefundPolicy.ExecuteAsync(amount, value =>
            {
                issued.Add(value);
                return Task.CompletedTask;
            }));
        }
        Check(issued.Count == 3, "Denied refunds must never reach the action.");
        foreach (var candidate in new object?[] { null, "250", 250, 250.5, double.NaN })
        {
            await ExpectDeniedAsync(() => RefundPolicy.Gate(candidate));
        }
        await RefundPolicy.Gate(250L);

        var actionError = new InvalidOperationException("Payment provider unavailable.");
        try
        {
            await RefundPolicy.ExecuteAsync(250L, _ => Task.FromException(actionError));
            throw new InvalidOperationException("Action errors must propagate.");
        }
        catch (InvalidOperationException error) when (ReferenceEquals(error, actionError))
        {
            Console.WriteLine("PASS: action errors propagate.");
        }

        var monitorError = new InvalidOperationException("Monitor unavailable.");
        var brokenGate = new PlainReferenceAdapter().CompilePreNode(new PreNode(
            "broken-monitor", "Never allow an unreadable monitor.",
            _ => Task.FromException<GammaEstimate>(monitorError),
            new AssuranceBasis(true, F2Modification.None)));
        try
        {
            await brokenGate(800L);
            throw new InvalidOperationException("Monitor errors must propagate.");
        }
        catch (InvalidOperationException error) when (ReferenceEquals(error, monitorError))
        {
            Console.WriteLine("PASS: monitor errors propagate.");
        }

        await ThresholdPolicy.Gate(800L);
        foreach (var candidate in new object?[] { null, "800", 0L, -1L, 1000L })
        {
            await ExpectDeniedAsync(() => ThresholdPolicy.Gate(candidate));
        }
        await ThresholdPolicy.Gate(800L);
        Check(!new GammaEstimate(1.1, 0.1).Sufficient(), "Equality must deny.");
        Check(new GammaEstimate(1.11, 0.1).Sufficient(), "Do not count the allowance twice.");
        Check(!new GammaEstimate(1.2, 0.2).Sufficient(), "Higher uncertainty raises the bar.");

        var failures = await ConformanceSuite.RunAsync(new PlainReferenceAdapter());
        Check(failures.Count == 0, string.Join(Environment.NewLine, failures));

        var path = Path.Combine(Path.GetTempPath(), $"vsl-guide-{Guid.NewGuid():N}.jsonl");
        try
        {
            await LedgerEvidence.RecordDenialAsync(path);
            var ledger = new VerbaLedger(new JsonlLedgerStore(path, fsync: true));
            Check(ledger.Store.AllEntries().Count() == 1, "The denial must persist after reopening.");
            Check(ledger.VerifyIntegrity(), "The recorded chain must verify.");
            Check(!ledger.Audit().AllPassed, "An unresolved denial must fail lifecycle audit.");
        }
        finally
        {
            File.Delete(path);
            File.Delete(path + ".lock");
        }
        Console.WriteLine("PASS: gate boundaries, failures, conformance, and persistent evidence.");
    }

    private static async Task ExpectDeniedAsync(Func<Task> action)
    {
        try
        {
            await action();
        }
        catch (AutomationDeniedException denied)
        {
            Console.WriteLine($"PASS: denied before action ({denied.Message}).");
            return;
        }
        throw new InvalidOperationException("Expected a governance denial.");
    }

    private static void Check(bool condition, string message)
    {
        if (!condition) throw new InvalidOperationException(message);
    }
}
