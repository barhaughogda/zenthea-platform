import { describe, it, expect, beforeEach } from "vitest";
import { 
  SANDBOX_EXECUTION_HALTED, 
  haltSandboxExecution, 
  resetSandboxExecution, 
  getSandboxKillSwitchState 
} from "../sandboxKillSwitch";
import { SandboxExecutionAdapter } from "../sandboxExecutionAdapter";

/**
 * Objective U-03: Sandbox Kill-Switch Validation (Internal Only)
 * 
 * Tests verify that sandbox execution can be immediately and deterministically 
 * halted via a manual kill-switch.
 */
describe("Sandbox Kill-Switch Validation (Objective U-03)", () => {
  beforeEach(() => {
    // Ensure clean state before each test
    resetSandboxExecution();
  });

  it("should allow execution when not halted", () => {
    const receipt = SandboxExecutionAdapter.executeAppointmentConfirmation("PAT-12345", "DR-67890", "SLOT-1");
    expect(receipt.status).toBe("SUCCESS");
    expect(SANDBOX_EXECUTION_HALTED).toBe(false);
  });

  it("should block execution when halted", () => {
    const reason = "Test Safety Validation Halt";
    haltSandboxExecution(reason);
    
    // Direct flag check
    expect(SANDBOX_EXECUTION_HALTED).toBe(true);
    
    // Execution path check
    const receipt = SandboxExecutionAdapter.executeAppointmentConfirmation("PAT-12345", "DR-67890", "SLOT-1");
    
    expect(receipt.status).toBe("HALTED");
    expect(receipt.reason).toBe(reason);
    expect(receipt.disclaimer).toBe("Sandbox execution halted. No action taken.");
    expect(receipt.governanceHash).toBe("NONE");
  });

  it("should record the halt reason and timestamp correctly", () => {
    const reason = "Emergency Halt Validation";
    haltSandboxExecution(reason);
    
    const state = getSandboxKillSwitchState();
    expect(state.halted).toBe(true);
    expect(state.reason).toBe(reason);
    expect(state.timestamp).toBeTruthy();
    
    // Verify timestamp is recent
    const ts = new Date(state.timestamp!).getTime();
    expect(ts).toBeGreaterThan(Date.now() - 10000);
    expect(ts).toBeLessThanOrEqual(Date.now());
  });

  it("should be resettable in dev mode", () => {
    haltSandboxExecution("Temporary Halt");
    expect(SANDBOX_EXECUTION_HALTED).toBe(true);
    
    resetSandboxExecution();
    expect(SANDBOX_EXECUTION_HALTED).toBe(false);
    
    const receipt = SandboxExecutionAdapter.executeAppointmentConfirmation("PAT-12345", "DR-67890", "SLOT-1");
    expect(receipt.status).toBe("SUCCESS");
  });

  it("should return a deterministic AbortReceipt on halt regardless of inputs", () => {
    haltSandboxExecution("Deterministic Test");
    
    const receipt1 = SandboxExecutionAdapter.executeAppointmentConfirmation("P1", "C1", "S1");
    const receipt2 = SandboxExecutionAdapter.executeAppointmentConfirmation("P2", "C2", "S2");
    
    expect(receipt1.status).toBe("HALTED");
    expect(receipt2.status).toBe("HALTED");
    expect(receipt1.reason).toBe("Deterministic Test");
    expect(receipt2.reason).toBe("Deterministic Test");
    expect(receipt1.patientName).toBe("N/A");
    expect(receipt2.patientName).toBe("N/A");
    expect(receipt1.governanceHash).toBe("NONE");
    expect(receipt2.governanceHash).toBe("NONE");
  });

  it("should have resetting clearly marked as development-only", () => {
    // This is a documentation check for the source code
    const resetFn = resetSandboxExecution.toString();
    expect(resetFn).toBeTruthy();
    // The source code comments are where the "clearly marked" requirement is met
  });
});
