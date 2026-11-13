import asyncio

from vsl_core.conformance.reference_adapter import PlainPythonReferenceAdapter
from vsl_core.constructs import PreNode
from vsl_core.exceptions import AutomationDeniedException
from vsl_core.metrics import (
    ROBUST_GAMMA_DEFAULT_THRESHOLD,
    AssuranceBasis,
    F2Modification,
    GammaEstimate,
)

BUDGET_CENTS = 100_000


async def budget_headroom(candidate: dict) -> GammaEstimate:
    amount = candidate.get("amount_cents")
    ratio = BUDGET_CENTS / amount if type(amount) is int and amount > 0 else 0.0
    return GammaEstimate(gamma_hat=ratio)


policy = PreNode(
    name="refund-budget-headroom",
    description="Require headroom above the robust Gamma threshold.",
    monitor=budget_headroom,
    assurance_basis=AssuranceBasis(
        f1_pre_commitment=True,
        f2_modification=F2Modification.NONE,
    ),
    gamma_threshold=ROBUST_GAMMA_DEFAULT_THRESHOLD,
)
gate = PlainPythonReferenceAdapter().compile_pre_node(policy)


async def main() -> None:
    for amount in (50_000, 100_000, 0):
        try:
            await gate({"amount_cents": amount})
        except AutomationDeniedException:
            print(f"{amount}: blocked")
        else:
            print(f"{amount}: allowed")


if __name__ == "__main__":
    asyncio.run(main())
