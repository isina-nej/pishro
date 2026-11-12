/**
 * Ignore external links, hash jumps and same-page interactions; only a real
 * internal page transition should arm a global loading indicator.
 */
export function isInternalPageNavigation(currentHref: string, targetHref: string): boolean {
  try {
    const current = new URL(currentHref);
    const target = new URL(targetHref, current);
    return current.origin === target.origin && current.pathname !== target.pathname;
  } catch {
    return false;
  }
}
