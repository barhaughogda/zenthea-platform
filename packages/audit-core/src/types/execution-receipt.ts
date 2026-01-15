/**
 * DESIGN-ONLY SKELETON — EXECUTION NOT ENABLED
 */

/**
 * Design-only representation of an execution receipt.
 *
 * CRITICAL: This receipt does NOT indicate execution occurred.
 * It is a structural placeholder for capturing audit event references.
 */
export interface ExecutionReceipt {
  readonly receiptId: string;
  readonly auditEventIds: readonly string[];
  readonly status: "DESIGN_ONLY_PENDING";
  readonly message: "This receipt does NOT indicate execution occurred";
}
