# Module & Import Conventions

## Import Extensions in TypeScript

### Convention
TypeScript imports **MUST NOT** include `.js` extensions.

**Correct:**
```typescript
import { someHelper } from './utils';
import { someType } from '../domain/types';
```

**Incorrect:**
```typescript
import { someHelper } from './utils.js';
import { someType } from '../domain/types.js';
```

### Rationale
- **Simplicity:** Modern bundlers and tools (Vitest, Turbo, Next.js) handle extension-less imports gracefully when configured with `moduleResolution: "Bundler"`.
- **Consistency:** Mixing imports with and without extensions creates ambiguity.
- **Tooling Support:** Using `moduleResolution: "Bundler"` in `tsconfig.json` is the recommended approach for monorepos, allowing for cleaner imports without forcing runtime-specific extensions into source code.
- **Future-Proofing:** It avoids tying source code to a specific output format or runtime behavior.

### Configuration
This convention is supported by the following configuration in `tsconfig.base.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false
  }
}
```

## Test Naming & Execution Model

### Convention
- **Unit Tests:** `*.test.ts`
- **AI Evaluation Tests:** `*.eval.test.ts`

### Execution Model
- `pnpm test` executes unit tests (`*.test.ts`) and excludes AI evaluation tests.
- `pnpm eval:ai` executes only AI evaluation tests (`*.eval.test.ts`).

### Rationale
- **Isolation:** AI evaluation tests often involve non-deterministic model calls, high latency, or cost. They should be run separately from fast unit tests.
- **Discovery:** Explicit naming allows tooling (Vitest, Turbo) to easily distinguish between test types.
- **Safety:** Ensuring that `pnpm test` is fast and reliable for core logic while `pnpm eval:ai` handles the specialized AI verification.
