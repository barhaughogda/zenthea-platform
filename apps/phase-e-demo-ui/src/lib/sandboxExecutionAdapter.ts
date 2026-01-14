/**
 * SANDBOX-ONLY. DO NOT REUSE.
 * 
 * Objective U-02: disposable, sandbox-only execution spike to validate 
 * technical feasibility of a single governed execution path.
 */

import { SANDBOX_EXECUTION_HALTED, getSandboxKillSwitchState } from "@/lib/sandboxKillSwitch";

export type ExecutionStatus = "SUCCESS" | "ABORT" | "DENIED" | "PENDING" | "HALTED";

export interface SandboxExecutionReceipt {
  executionId: string;
  status: ExecutionStatus;
  ts: string;
  patientName: string;
  clinicianName: string;
  appointmentTime: string;
  governanceHash: string;
  disclaimer: string;
  reason?: string;
}

/**
 * Sandbox-only. Do not reuse.
 * In-memory only. Synchronous only. Deterministic.
 */
export class SandboxExecutionAdapter {
  /**
   * Executes a simulated appointment confirmation.
   * Required ONE execution candidate: Simulated appointment confirmation.
   */
  public static executeAppointmentConfirmation(
    patientId: string,
    clinicianId: string,
    slotId: string
  ): SandboxExecutionReceipt {
    console.log("[SANDBOX EXECUTION] Checking kill-switch authority...");

    if (SANDBOX_EXECUTION_HALTED) {
      const haltState = getSandboxKillSwitchState();
      console.error("[SANDBOX EXECUTION] BLOCKED: Kill-switch is active.");
      
      return {
        executionId: `sbx-halted-${Date.now()}`,
        status: "HALTED",
        ts: new Date().toISOString(),
        patientName: "N/A",
        clinicianName: "N/A",
        appointmentTime: "N/A",
        governanceHash: "NONE",
        reason: haltState.reason || "Unknown",
        disclaimer: "Sandbox execution halted. No action taken.",
      };
    }

    console.log("[SANDBOX EXECUTION] Initiating simulated appointment confirmation...");
    console.log(`[SANDBOX EXECUTION] Patient: ${patientId}, Clinician: ${clinicianId}, Slot: ${slotId}`);

    // HARDCODED CANDIDATE
    const receipt: SandboxExecutionReceipt = {
      executionId: `sbx-${Date.now()}`,
      status: "SUCCESS",
      ts: new Date().toISOString(),
      patientName: "Sarah Chen (PAT-12345)",
      clinicianName: "Dr. Aris Thorne",
      appointmentTime: "2026-01-20T10:00:00Z",
      governanceHash: "gov_u02_spike_validated",
      disclaimer: "This action had no external effects.",
    };

    console.log("[SANDBOX EXECUTION] Success. Receipt generated.");
    return receipt;
  }
}
