// Portal Component Z-Index Values
export const PORTAL_Z_INDEX = {
  /** Base z-index for portal components (dialogs, sheets, popovers, etc.) */
  BASE: 99999999998,
  /** Z-index for portal content (highest layer) */
  CONTENT: 99999999999,
} as const;

// UI Component Z-Index Values
export const UI_Z_INDEX = {
  /** Tooltip z-index */
  TOOLTIP: PORTAL_Z_INDEX.CONTENT,
  /** Dropdown menu z-index */
  DROPDOWN_MENU: PORTAL_Z_INDEX.CONTENT,
  /** Popover z-index */
  POPOVER: PORTAL_Z_INDEX.CONTENT,
  /** Select dropdown z-index */
  SELECT: PORTAL_Z_INDEX.CONTENT,
  /** Dialog overlay z-index */
  DIALOG_OVERLAY: PORTAL_Z_INDEX.BASE,
  /** Dialog content z-index */
  DIALOG_CONTENT: PORTAL_Z_INDEX.CONTENT,
  /** Sheet overlay z-index */
  SHEET_OVERLAY: PORTAL_Z_INDEX.BASE,
  /** Sheet content z-index */
  SHEET_CONTENT: PORTAL_Z_INDEX.CONTENT,
} as const;
