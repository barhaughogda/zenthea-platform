/**
 * Opaque Cursor Types (v1)
 * ⚠️ SECURITY: Cursors encode ordering keys but MUST NOT include:
 * - tenantId
 * - actorId
 * - requestId
 * - PHI/PII
 * - payloads
 */

export interface CursorV1 {
  timestamp: string;
  secondaryKey: string;
}

/**
 * Encodes a CursorV1 object into a base64 string.
 */
export function encodeCursorV1(cursor: CursorV1): string {
  const json = JSON.stringify(cursor);
  return Buffer.from(json).toString('base64');
}

/**
 * Decodes a base64 string into a CursorV1 object.
 * Returns null if the cursor is invalid.
 */
export function decodeCursorV1(cursorStr: string): CursorV1 | null {
  try {
    const json = Buffer.from(cursorStr, 'base64').toString('utf8');
    const parsed = JSON.parse(json);
    
    if (typeof parsed.timestamp !== 'string' || typeof parsed.secondaryKey !== 'string') {
      return null;
    }
    
    return {
      timestamp: parsed.timestamp,
      secondaryKey: parsed.secondaryKey
    };
  } catch {
    return null;
  }
}

/**
 * Pagination parameters for operator APIs.
 */
export interface PaginationParamsV1 {
  cursor?: string;
  limit?: number;
}

/**
 * Generic paginated response structure.
 */
export interface PaginatedResponseV1<T> {
  version: 'v1';
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
  count: number;
}
