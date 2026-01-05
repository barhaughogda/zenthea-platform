# Patient Portal

## Purpose
The Patient Portal is a secure, mobile-first application designed to provide patients with a unified interface for managing their healthcare interactions. It serves as the primary touchpoint for patients within the Zenthea platform.

## Target Users
- Patients seeking to access their health records, book appointments, and communicate with healthcare providers.
- Caregivers managing health for family members.

## In-Scope Behavior
- **Mobile-First Navigation**: Responsive layout shell designed for ease of use on touch devices.
- **Service Composition**: A shell designed to integrate various platform services (Appointment Booking, Medical Advisor, etc.).
- **Consistent UI**: Uses `@starter/ui` for a unified platform look and feel.
- **Read-Only Discovery**: Initial implementation focuses on layout and navigation primitives.

## Explicit Non-Goals
- **No Writes**: This application does not currently support data persistence or state modification.
- **No Clinical Decisions**: The UI provides information but does not perform diagnostic or clinical decision-making.
- **No Backend Calls**: All data is currently local or placeholder (mocked data not yet implemented).
- **No Auth Implementation**: Authentication and tenant context are assumed to be handled at the platform layer; this app currently operates in an unauthenticated discovery mode.

## Development Instructions
1. Install dependencies: `pnpm install`
2. Run development server: `pnpm --filter @starter/patient-portal dev`
3. Run linting: `pnpm --filter @starter/patient-portal lint`
4. Run typechecking: `pnpm --filter @starter/patient-portal typecheck`
5. Build for production: `pnpm --filter @starter/patient-portal build`

## Key Workflows (Future)
- Appointment scheduling
- Viewing health summaries
- Chatting with clinical agents
- Managing consent and privacy settings

## Compliance Notes
- Designed with HIPAA and GDPR principles in mind (minimal data leakage, clear consent paths).
- PHI redaction patterns will be applied once data integration begins.
