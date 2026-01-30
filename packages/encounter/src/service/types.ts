/**
 * Encounter Service Error Types
 */

export type ServiceErrorType =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "INVALID_STATE"
  | "CONFLICT"
  | "SYSTEM_ERROR";

export interface ServiceError {
  type: ServiceErrorType;
  message: string;
}
