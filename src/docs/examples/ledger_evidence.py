from vsl_core.ledger import VerbaLedger


def build_ledger() -> VerbaLedger:
    ledger = VerbaLedger()
    ledger.write_gate_decision(
        identity_key="refund-agent",
        primitive_name="refund-within-limit",
        allowed=True,
        decision_id="refund-001",
    )
    ledger.write_gate_decision(
        identity_key="refund-agent",
        primitive_name="refund-within-limit",
        allowed=False,
        decision_id="refund-002",
    )
    return ledger


if __name__ == "__main__":
    ledger = build_ledger()
    print("Chain intact:", ledger.verify_integrity())
    report = ledger.audit()
    print("Lifecycle complete:", report.all_passed)
    print("Unresolved checks:", ", ".join(report.checks_failed))
