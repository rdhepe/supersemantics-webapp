using SuperSemantics.Vsl;
using SuperSemantics.Vsl.Conformance;

namespace VslGuide;

public static class ThresholdPolicy
{
    public static GammaEstimate Estimate(object? candidate) =>
        new(candidate is long amount and > 0 ? 1000.0 / amount : 0.0,
            deltaEstimationError: 0.1);

    public static readonly CompiledGate Gate = new PlainReferenceAdapter().CompilePreNode(
        new PreNode(
            name: "budget-headroom",
            description: "Available budget / requested amount must clear the robust threshold.",
            monitor: candidate => Task.FromResult(Estimate(candidate)),
            assuranceBasis: new AssuranceBasis(true, F2Modification.None),
            gammaThreshold: Thresholds.RobustGammaDefault));
}
