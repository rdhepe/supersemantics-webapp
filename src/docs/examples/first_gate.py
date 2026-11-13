import asyncio

from vsl_core.conformance.reference_adapter import PlainPythonReferenceAdapter
from vsl_core.constructs import Invariant
from vsl_core.exceptions import InvariantViolation
from vsl_core.metrics import AssuranceBasis, F2Modification

LIMIT_CENTS = 50_000
executed_refunds: list[int] = []


async def within_refund_limit(candidate: dict) -> bool:
    amount = candidate.get("amount_cents")
    return type(amount) is int and 0 < amount <= LIMIT_CENTS


policy = Invariant(
    name="refund-within-limit",
    description="Only positive integer amounts up to 50,000 cents.",
    rule=within_refund_limit,
    assurance_basis=AssuranceBasis(
        f1_pre_commitment=True,
        f2_modification=F2Modification.NONE,
    ),
)
gate = PlainPythonReferenceAdapter().compile_invariant(policy)


async def process_refund(candidate: dict) -> bool:
    try:
        await gate(candidate)
    except InvariantViolation:
        print(f"BLOCKED: {candidate.get('amount_cents')}")
        return False

    # This in-memory operation stands in for a real side effect.
    executed_refunds.append(candidate["amount_cents"])
    print(f"ALLOWED: {candidate['amount_cents']}")
    return True


async def main() -> None:
    await process_refund({"amount_cents": 20_000})
    await process_refund({"amount_cents": 90_000})
    assert executed_refunds == [20_000]
    print("Only the allowed action ran.")


if __name__ == "__main__":
    asyncio.run(main())
