import unittest

import first_gate
import threshold_gate
from ledger_evidence import build_ledger
from vsl_core.exceptions import AutomationDeniedException
from vsl_core.metrics import GammaEstimate


class RefundGateTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self) -> None:
        first_gate.executed_refunds.clear()

    async def test_allowed_action_runs(self) -> None:
        self.assertTrue(await first_gate.process_refund({"amount_cents": 20_000}))
        self.assertEqual(first_gate.executed_refunds, [20_000])

    async def test_denied_action_never_runs(self) -> None:
        self.assertFalse(await first_gate.process_refund({"amount_cents": 90_000}))
        self.assertEqual(first_gate.executed_refunds, [])

    async def test_invalid_amounts_fail_closed(self) -> None:
        for amount in (0, -1, None, "20000", True):
            with self.subTest(amount=amount):
                self.assertFalse(
                    await first_gate.process_refund({"amount_cents": amount})
                )
        self.assertEqual(first_gate.executed_refunds, [])

    async def test_missing_amount_fails_closed(self) -> None:
        self.assertFalse(await first_gate.process_refund({}))
        self.assertEqual(first_gate.executed_refunds, [])

    async def test_pre_node_allows_sufficient_headroom(self) -> None:
        await threshold_gate.gate({"amount_cents": 50_000})

    async def test_pre_node_denies_break_even(self) -> None:
        with self.assertRaises(AutomationDeniedException):
            await threshold_gate.gate({"amount_cents": 100_000})


class EvidenceTests(unittest.TestCase):
    def test_gamma_threshold_is_strict(self) -> None:
        self.assertFalse(GammaEstimate(gamma_hat=1.1).sufficient())
        self.assertTrue(GammaEstimate(gamma_hat=1.11).sufficient())
        self.assertFalse(
            GammaEstimate(gamma_hat=1.2, delta_estimation_error=0.3).sufficient()
        )

    def test_integrity_is_not_lifecycle_completeness(self) -> None:
        ledger = build_ledger()
        self.assertTrue(ledger.verify_integrity())
        self.assertFalse(ledger.audit().all_passed)
        self.assertIn(
            "drift_flagged_monitor_has_pre_node", ledger.audit().checks_failed
        )


if __name__ == "__main__":
    unittest.main()
