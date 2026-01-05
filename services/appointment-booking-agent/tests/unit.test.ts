import { describe, it, expect } from 'vitest';
import { DomainValidator } from '../domain';

describe('Appointment Booking Agent - Unit Tests', () => {
  describe('DomainValidator', () => {
    it('should validate a correct appointment slot', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      const slot = {
        slotId: '123',
        providerId: 'abc',
        startTime: futureDate,
        endTime: new Date(futureDate.getTime() + 30 * 60 * 1000),
        status: 'available' as const,
      };
      
      expect(DomainValidator.isValidSlot(slot)).toBe(true);
    });

    it('should invalidate a slot in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const slot = {
        slotId: '123',
        providerId: 'abc',
        startTime: pastDate,
        endTime: new Date(pastDate.getTime() + 30 * 60 * 1000),
        status: 'available' as const,
      };
      
      expect(DomainValidator.isValidSlot(slot)).toBe(false);
    });
  });
});
