/**
 * Phase Y-02: Scheduling Domain Execution Skeleton
 * Execution is NOT ENABLED
 * Design-only scaffolding per W-04 §7
 *
 * This code does not enable execution.
 * This code must not be imported into runtime paths yet.
 * This code exists solely to validate architectural feasibility.
 *
 * EXECUTION STATUS: BLOCKED
 */

/**
 * Required Human Roles per W-04 §7.1.
 *
 * Every executable action requires human authority at defined control points.
 * No action within the Scheduling & Orders domain may proceed without human
 * initiation (per W-04 §7.3).
 */
export enum HumanRole {
  /**
   * PATIENT: May submit scheduling requests; may withdraw own proposals;
   * may request cancellation per policy.
   * Authority domain: Own scheduling records.
   */
  PATIENT = 'PATIENT',

  /**
   * PROVIDER: May review, modify, confirm, or reject scheduling proposals;
   * may create, confirm, modify, or revoke orders.
   * Authority domain: Patients under their care.
   */
  PROVIDER = 'PROVIDER',

  /**
   * STAFF: May review and confirm scheduling proposals per policy;
   * may NOT create or modify clinical orders.
   * Authority domain: Administrative scheduling.
   */
  STAFF = 'STAFF',

  /**
   * OPERATOR: May view scheduling and order status;
   * may confirm non-clinical scheduling per policy.
   * Authority domain: Operational oversight.
   */
  OPERATOR = 'OPERATOR',

  /**
   * AUDITOR: May review all scheduling and order records and audit trails.
   * Authority domain: All records (read-only).
   */
  AUDITOR = 'AUDITOR',
}

/**
 * Action types within the Scheduling & Orders domain.
 * Per W-04 §5, these are conceptual actions that are NOT ENABLED.
 */
export enum SchedulingAction {
  /** W-04 §5.1: Creating a formalised scheduling proposal for review */
  APPOINTMENT_PROPOSAL = 'APPOINTMENT_PROPOSAL',

  /** W-04 §5.2: Confirming a scheduling proposal, creating a binding time allocation */
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',

  /** W-04 §5.3: Modifying a confirmed schedule through governed workflow */
  APPOINTMENT_MODIFICATION = 'APPOINTMENT_MODIFICATION',

  /** W-04 §5.4: Cancelling a confirmed schedule through governed workflow */
  APPOINTMENT_CANCELLATION = 'APPOINTMENT_CANCELLATION',
}

export enum OrderAction {
  /** W-04 §5.5: Creating an order record as a record of clinical intent */
  ORDER_CREATION = 'ORDER_CREATION',

  /** W-04 §5.6: Revoking a previously created or confirmed order */
  ORDER_REVOCATION = 'ORDER_REVOCATION',
}

/**
 * Control point requirements per W-04 §7.2.
 * Specifies the human authority required at each control point.
 */
export interface ControlPointRequirement {
  readonly action: SchedulingAction | OrderAction;
  readonly initiationAuthority: HumanRole[];
  readonly confirmationAuthority: HumanRole[] | null;
  readonly auditAuthority: HumanRole[];
}

/**
 * Control point requirements array per W-04 §7.2.
 * This is a compile-time constant for type safety.
 *
 * Every executable action requires human authority at defined control points.
 */
export const CONTROL_POINT_REQUIREMENTS: readonly ControlPointRequirement[] = [
  {
    action: SchedulingAction.APPOINTMENT_PROPOSAL,
    initiationAuthority: [HumanRole.PATIENT, HumanRole.PROVIDER, HumanRole.STAFF],
    confirmationAuthority: null, // N/A for proposal
    auditAuthority: [HumanRole.AUDITOR, HumanRole.OPERATOR],
  },
  {
    action: SchedulingAction.APPOINTMENT_CONFIRMATION,
    initiationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    confirmationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    auditAuthority: [HumanRole.AUDITOR, HumanRole.OPERATOR],
  },
  {
    action: SchedulingAction.APPOINTMENT_MODIFICATION,
    initiationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF, HumanRole.PATIENT],
    confirmationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    auditAuthority: [HumanRole.AUDITOR, HumanRole.OPERATOR],
  },
  {
    action: SchedulingAction.APPOINTMENT_CANCELLATION,
    initiationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF, HumanRole.PATIENT],
    confirmationAuthority: [HumanRole.PROVIDER, HumanRole.STAFF],
    auditAuthority: [HumanRole.AUDITOR, HumanRole.OPERATOR],
  },
  {
    action: OrderAction.ORDER_CREATION,
    initiationAuthority: [HumanRole.PROVIDER],
    confirmationAuthority: [HumanRole.PROVIDER],
    auditAuthority: [HumanRole.AUDITOR],
  },
  {
    action: OrderAction.ORDER_REVOCATION,
    initiationAuthority: [HumanRole.PROVIDER],
    confirmationAuthority: null, // Immediate per W-04 §7.2
    auditAuthority: [HumanRole.AUDITOR],
  },
];

/**
 * Get control point requirements for a specific action.
 */
export function getControlPointRequirement(
  action: SchedulingAction | OrderAction
): ControlPointRequirement | undefined {
  return CONTROL_POINT_REQUIREMENTS.find((req) => req.action === action);
}

/**
 * Prohibited activities for assistants per W-04 §11.2.
 * These are enumerated for compile-time validation.
 *
 * The following activities are explicitly prohibited for all assistant surfaces.
 */
export enum ProhibitedAssistantActivity {
  /** Confirmation requires human authority */
  CONFIRM_SCHEDULING_PROPOSALS = 'CONFIRM_SCHEDULING_PROPOSALS',

  /** Appointment confirmation requires human authorisation */
  CREATE_CONFIRMED_APPOINTMENTS = 'CREATE_CONFIRMED_APPOINTMENTS',

  /** Order execution is out of scope and requires human authorisation */
  EXECUTE_ORDERS = 'EXECUTE_ORDERS',

  /** Modification of confirmed schedules requires human authorisation */
  MODIFY_CONFIRMED_SCHEDULES = 'MODIFY_CONFIRMED_SCHEDULES',

  /** Cancellation requires human confirmation */
  CANCEL_APPOINTMENTS = 'CANCEL_APPOINTMENTS',

  /** Order modification requires clinical authority */
  MODIFY_ORDER_RECORDS = 'MODIFY_ORDER_RECORDS',

  /** Order revocation requires clinical authority */
  REVOKE_ORDERS = 'REVOKE_ORDERS',

  /** All notifications require human confirmation */
  DISPATCH_NOTIFICATIONS = 'DISPATCH_NOTIFICATIONS',

  /** Execution is not authorised */
  TRIGGER_EXECUTION_WORKFLOWS = 'TRIGGER_EXECUTION_WORKFLOWS',

  /** Scheduling must be explicitly requested */
  INFER_SCHEDULING_INTENT = 'INFER_SCHEDULING_INTENT',

  /** Orders must be explicitly created by clinicians */
  INFER_ORDER_INTENT = 'INFER_ORDER_INTENT',

  /** All assistant-generated content must pass through human review */
  BYPASS_HUMAN_REVIEW = 'BYPASS_HUMAN_REVIEW',

  /** Assistants hold no clinical authority */
  ASSUME_CLINICAL_AUTHORITY = 'ASSUME_CLINICAL_AUTHORITY',

  /** Clinical decisions require human clinicians */
  MAKE_CLINICAL_RECOMMENDATIONS = 'MAKE_CLINICAL_RECOMMENDATIONS',

  /** Each record must be individually handled */
  BULK_PROCESS_RECORDS = 'BULK_PROCESS_RECORDS',
}

/**
 * Complete list of all prohibited assistant activities.
 * Used for compile-time verification that no assistant code path
 * can invoke these activities.
 */
export const ALL_PROHIBITED_ASSISTANT_ACTIVITIES: readonly ProhibitedAssistantActivity[] =
  Object.values(ProhibitedAssistantActivity);
