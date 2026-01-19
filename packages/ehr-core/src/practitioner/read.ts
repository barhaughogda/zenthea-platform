/**
 * Practitioner Read Model - Phase F.2 Slice 2
 *
 * Derived, non-authoritative, immutable read views for Practitioner.
 */

import type { PractitionerRepository } from "./repository.js";
import type { PractitionerReadView } from "./types.js";

export class PractitionerReadModel {
  private readonly repository: PractitionerRepository;

  constructor(repository: PractitionerRepository) {
    this.repository = repository;
  }

  /**
   * Get a practitioner by ID.
   * Enforces tenant isolation.
   * Returns frozen immutable view.
   */
  getById(tenantId: string, id: string): PractitionerReadView | undefined {
    const record = this.repository.findById(tenantId, id);
    if (!record) {
      return undefined;
    }

    return Object.freeze({
      id: record.id,
      tenantId: record.tenantId,
      displayName: record.displayName,
      role: record.role,
      active: record.active,
    });
  }

  /**
   * List all practitioners for a tenant.
   */
  listAll(tenantId: string): PractitionerReadView[] {
    return this.repository.findAllByTenant(tenantId).map((record) =>
      Object.freeze({
        id: record.id,
        tenantId: record.tenantId,
        displayName: record.displayName,
        role: record.role,
        active: record.active,
      })
    );
  }
}
