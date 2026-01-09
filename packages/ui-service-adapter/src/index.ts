/**
 * UI -> Service Adapter Boundary
 * Phase A: Interfaces only. No implementation.
 */

export interface SurfaceContext {
  readonly surfaceId: string;
  readonly tenantId: string;
  readonly actorId: string;
  readonly correlationId: string;
}

export interface ServiceResult<T> {
  readonly success: boolean;
  readonly payload?: T;
  readonly auditReference?: string;
  readonly error?: {
    readonly code: string;
    readonly message: string;
  };
}

/**
 * Patient Portal Surface (MIG-02B)
 * Mediates access to patient-scoped data and appointments.
 */
export interface PatientPortalSurface {
  getProfile(ctx: SurfaceContext): Promise<ServiceResult<unknown>>;
  listAppointments(ctx: SurfaceContext): Promise<ServiceResult<unknown[]>>;
  bookAppointment(ctx: SurfaceContext, params: unknown): Promise<ServiceResult<unknown>>;
}

/**
 * Provider Portal Surface (MIG-03)
 * Mediates clinical workflows and patient management.
 */
export interface ProviderPortalSurface {
  getClinicalSummary(ctx: SurfaceContext, patientId: string): Promise<ServiceResult<unknown>>;
  updatePatientRecord(ctx: SurfaceContext, patientId: string, delta: unknown): Promise<ServiceResult<unknown>>;
  attestNote(ctx: SurfaceContext, noteId: string): Promise<ServiceResult<unknown>>;
}

/**
 * Website Builder Surface (MIG-01)
 * Non-clinical public-facing site management.
 */
export interface WebsiteBuilderSurface {
  getSiteConfig(ctx: SurfaceContext): Promise<ServiceResult<unknown>>;
  publishPage(ctx: SurfaceContext, pageId: string): Promise<ServiceResult<unknown>>;
}

/**
 * Company Settings Surface (MIG-00)
 * Tenant-level configuration.
 */
export interface CompanySettingsSurface {
  getTenantConfig(ctx: SurfaceContext): Promise<ServiceResult<unknown>>;
  updatePolicies(ctx: SurfaceContext, updates: unknown): Promise<ServiceResult<unknown>>;
}
