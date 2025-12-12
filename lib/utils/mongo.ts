export function isValidObjectId(id?: unknown): id is string {
  if (typeof id !== "string") return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default isValidObjectId;
