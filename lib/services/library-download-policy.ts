/** Permission policy for public book downloads. Pricing/ownership is server-checked. */
export function canDownloadBookContent(
  status: string | undefined,
  price: number | null | undefined,
  isAdmin: boolean
): boolean {
  return isAdmin || (status === "PUBLISHED" && !(price && price > 0));
}
