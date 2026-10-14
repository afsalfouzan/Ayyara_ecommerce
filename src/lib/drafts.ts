import { isLiveSite } from './site';

/**
 * Whether draft content (articles, bios and answers awaiting the client's
 * approval) is shown. Always while developing; on staging only when
 * SHOW_DRAFTS=true is set, so the client can review it there. Never on the
 * live site, whatever the setting.
 */
export const showDrafts = !isLiveSite && (process.env.NODE_ENV === 'development' || process.env.SHOW_DRAFTS === 'true');

/** True when an item may be shown: approved, or a draft while drafts are shown. */
export function isVisible(item: { draft?: boolean }) {
  return !item.draft || showDrafts;
}
