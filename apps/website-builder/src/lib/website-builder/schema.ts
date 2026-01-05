/**
 * Website Builder Schema and Types
 *
 * Central entry point for all website builder definitions.
 * Re-exports from focused modules to avoid circular dependencies.
 */

// Re-export core types and constants
export * from './types';

// Re-export validation schemas and helpers
export * from './zod-schemas';
import { 
  blockMetadata, 
} from './zod-schemas';
export { 
  blockMetadata as BLOCK_METADATA,
};

// Re-export content generators
export * from './content-generators';

// Re-export metadata
export * from './metadata';
