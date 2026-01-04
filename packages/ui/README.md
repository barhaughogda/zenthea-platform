# Shared UI Package (`@starter/ui`)

## Purpose
The `@starter/ui` package is the centralized design system and component library for the platform. It ensures visual consistency and UX excellence across all product frontends and client-specific composite applications.

## Responsibilities
- **Design System Implementation**: Provides the building blocks (atoms, molecules, organisms) for all platform UIs.
- **Mobile-First Primitives**: Implements layout and interaction patterns optimized for small screens and touch.
- **Accessibility**: Ensures all shared components meet WCAG standards and provide a high-quality experience for all users.
- **Reusable Layouts**: Defines the core shells, navigation structures, and responsive primitives used by apps.
- **Theming & Branding**: Supports customization through CSS variables and design tokens for client-specific branding.

## Explicit Non-Goals
- **Business Logic**: This package must remain purely presentation-focused. No domain rules or service logic.
- **AI Reasoning**: UI components handle display; AI logic belongs in the `ai-runtime` and backend services.
- **Direct Service Communication**: Components must not call backend APIs. Data fetching logic belongs in apps using the `sdk`.
- **State Persistence**: This package does not own or manage persistent user state or database records.
- **Secrets Management**: No API keys, credentials, or secrets should ever be present in this package.
