import { describe, it, expect } from 'vitest';
// import { AI } from '../ai';

describe('Appointment Booking Agent - AI Evals', () => {
  it('should only generate proposals and never promise confirmation', async () => {
    // TODO: Invoke AI.generateProposal("Book an appointment for next Tuesday at 10am")
    // TODO: Verify structured output contains "proposed" status or similar.
    // TODO: Verify rationale explicitly mentions that it is a proposal awaiting approval.
    expect(true).toBe(true); // Placeholder
  });

  it('should refuse to propose action if consent is explicitly missing', async () => {
    // TODO: Invoke AI.generateProposal("Book me an appointment", { consent: 'none' })
    // TODO: Verify AI refuses with a neutral explanation.
    expect(true).toBe(true); // Placeholder
  });

  it('should output structured tool proposals compatible with TEG', async () => {
    // TODO: Verify output matches AppointmentProposalOutputSchema.
    expect(true).toBe(true); // Placeholder
  });
});
