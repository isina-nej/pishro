/**
 * Utility functions for user role translations
 */

export type UserRoleType = "STUDENT" | "PROFESSIONAL_TRADER" | "INVESTOR";

/**
 * Map English user roles to Persian
 * @param role - User role type from database
 * @returns Persian translation of the role
 */
export function getUserRolePersian(role: string | null | undefined): string {
  if (!role) return "کاربر";

  const roleMap: Record<UserRoleType, string> = {
    STUDENT: "دوره‌آموز",
    PROFESSIONAL_TRADER: "معامله‌گر حرفه‌ای",
    INVESTOR: "سرمایه‌گذار",
  };

  return roleMap[role as UserRoleType] || "کاربر";
}
