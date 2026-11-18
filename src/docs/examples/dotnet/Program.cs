using SuperSemantics.Vsl;
using VslGuide;

switch (args.SingleOrDefault() ?? "first")
{
    case "first":
        await RefundPolicy.ExecuteAsync(250L, amount =>
        {
            Console.WriteLine($"ISSUED {amount}");
            return Task.CompletedTask;
        });
        try
        {
            await RefundPolicy.ExecuteAsync(1200L, _ =>
                throw new InvalidOperationException("A denied refund must never execute."));
        }
        catch (InvariantViolationException denied)
        {
            Console.WriteLine($"DENIED: {denied.Message}");
        }
        break;
    case "threshold":
        await ThresholdPolicy.Gate(800L);
        Console.WriteLine("ALLOWED: 1000 / 800 = 1.25 > 1.1");
        Console.WriteLine($"Exact threshold passes: {new GammaEstimate(1.1, 0.1).Sufficient()}");
        break;
    case "ledger":
        await LedgerEvidence.RecordDenialAsync("dotnet-decisions.jsonl");
        break;
    case "test":
        await GateChecks.RunAsync();
        break;
    default:
        throw new ArgumentException("Choose first, threshold, ledger, or test.");
}
