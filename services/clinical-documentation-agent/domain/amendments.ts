import { 
  Amendment, 
  AmendmentType, 
  DraftVersion 
} from './types';

/**
 * Creates an amendment/addendum to a specific version of a draft.
 * Amendments are append-only and do not modify the original version.
 */
export function createAmendment(
  params: {
    amendmentId: string;
    draftId: string;
    targetsVersionId: string;
    type: AmendmentType;
    reason: string;
    text: string;
    createdBy: string;
  }
): Amendment {
  if (!params.reason) {
    throw new Error('Amendment reason is required');
  }

  return {
    amendmentId: params.amendmentId,
    draftId: params.draftId,
    targetsVersionId: params.targetsVersionId,
    type: params.type,
    reason: params.reason,
    text: params.text,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
  };
}
