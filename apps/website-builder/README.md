# Website Builder

## Purpose
The Website Builder is a frontend application designed to allow users to create and customize their own websites through a drag-and-drop or template-based interface. It serves as a core part of the Zenthea platform's content management capabilities.

## Non-Goals
- This app does not handle its own backend persistence (delegated to services).
- This app does not manage authentication (delegated to the platform's auth system).
- No business logic or domain rules are embedded in the UI components.

## Target Users
- Small business owners needing a simple web presence.
- Platform users creating landing pages for AI-driven workflows.

## Services Used
- Currently standalone (composition of UI primitives).

## Key Workflows
- Canvas-based editing (planned).
- Template selection (planned).
- Preview and Publish (planned).

## Auth and Tenant Assumptions
- Assumes authentication and tenant context are provided by the platform shell.
- No ad-hoc auth implementation within this app.

## Development Instructions
```bash
pnpm install
pnpm dev
```

## Deployment Notes
- Standard Next.js deployment.

## Compliance Notes
- Follows Zenthea's accessibility and mobile-first guidelines.
