# AI-platform-monorepo-starter Client Demo (Example Implementation)

> **Note**: This application is a Reference Implementation. It demonstrates how to compose multiple service-driven frontends into a single cohesive client application.

## Architecture

Follows [ADR-005: Frontend Composition](../../docs/10-decisions/adr-005-frontend-composition.md).

- **Composition Layer**: This application acts as the composition layer.
- **Service UIs**: It imports and embeds UI components from Product Frontends (e.g., `@starter/chat-ui`).
- **No Business Logic**: All business logic remains in the respective services or SDKs.

## Structure

- `/src/app`: Next.js App Router.
  - `layout.tsx`: Shared layout and navigation.
  - `page.tsx`: Unified dashboard.
  - `chat/page.tsx`: Embedded Chat service.

## Adding New Services

To compose a new service:
1. Ensure the Product Frontend (e.g., `apps/sales-ui`) exports its main features.
2. Add the package to `dependencies` in `package.json`.
3. Add the package to `transpilePackages` in `next.config.mjs`.
4. Create a new route in `src/app` and embed the service's components.
5. Add the route to the navigation in `layout.tsx`.
