using SuperSemantics.Vsl;

namespace VslGuide;

public static class LedgerEvidence
{
    public static async Task RecordDenialAsync(string path)
    {
        var ledger = new VerbaLedger(new JsonlLedgerStore(path, fsync: true));
        var decisionId = Guid.NewGuid().ToString();

        try
        {
            await RefundPolicy.Gate(1200L);
            throw new InvalidOperationException("The over-limit refund unexpectedly passed.");
        }
        catch (InvariantViolationException denied)
        {
            ledger.WriteGateDecision(
                identityKey: "refund-agent",
                primitiveName: RefundPolicy.Name,
                allowed: false,
                decisionId: decisionId);
            Console.WriteLine($"DENIED: {denied.Message}");
        }

        var reopened = new VerbaLedger(new JsonlLedgerStore(path, fsync: true));
        Console.WriteLine($"Integrity: {reopened.VerifyIntegrity()}");
        Console.WriteLine($"Lifecycle complete: {reopened.Audit().AllPassed}");
    }
}
