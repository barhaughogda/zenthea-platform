# Phase AJ-02: Read-Only UI Scaffolding

## Overview
This document defines the governance and scope for Phase AJ-02, introducing initial READ-ONLY UI scaffolding for the Zenthea platform. This is the first phase where UI code is permitted.

## Scope of Scaffolding
- **MUST** include only presentational Next.js pages, layouts, and routing.
- **MUST** use SHADCN UI components as visual primitives only.
- **MAY** include navigation, headers, sidebars, and empty views.
- **MAY** use static mock data defined inline.
- **MUST** clearly label all interactive elements as "proposal" or "preview".

## Prohibited Actions
- **MUST NOT** call any backend APIs or include server actions.
- **MUST NOT** persist data in any form (database, localStorage, cookies, etc.).
- **MUST NOT** include forms that submit or buttons labeled "Save", "Submit", "Confirm", "Execute", "Apply", or "Approve".
- **MUST NOT** include any logic beyond rendering and basic client-side navigation.
- **MUST NOT** introduce side effects, analytics, or telemetry.

## Execution Prevention
- All UI elements are informational only.
- Closing the browser session MUST reverse all visual interactions.
- Buttons MUST be limited to "Propose", "Preview", "View", or "Inspect" labels.
- Workflow semantics MUST NOT be encoded into components.

## Shadcn Safety
- SHADCN components are used strictly for visual layout.
- No behavioral hooks or state management related to data mutation shall be integrated.

## Status
**EXECUTION IS NOT ENABLED.** All UI code produced in this phase is for visualization and structural proposal only.
