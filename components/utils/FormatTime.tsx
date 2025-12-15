// utils/formatTime.ts

import { Clock } from "lucide-react";

/**
 * Format time for display - supports both Persian text and HH:MM format
 * @param time - time string (e.g., "30 ساعت" or "12:30")
 * @returns formatted time string in Persian
 */
const formatTime = (time: string): string => {
  if (!time) return "۰ دقیقه";

  // If already in Persian text format (e.g., "30 ساعت"), return as-is
  if (time.includes("ساعت") || time.includes("دقیقه")) {
    return time;
  }

  // Otherwise, try to parse as HH:MM or HH:MM:SS format
  const timeParts = time.split(":");
  if (timeParts.length < 2) return "۰ دقیقه";

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  // Validate parsed numbers
  if (isNaN(hours) || isNaN(minutes)) return "۰ دقیقه";

  let result = "";
  if (hours > 0) {
    result += `${hours.toLocaleString("fa-IR")} ساعت`;
  }
  if (minutes > 0) {
    result += `${result ? " و " : ""}${minutes.toLocaleString("fa-IR")} دقیقه`;
  }

  return result || "۰ دقیقه";
};

export const FormatTime = ({ time }: { time: string }) => {
  return (
    <span className="flex items-center gap-1">
      <Clock size={20} className="text-gray-900 mb-1" />
      {formatTime(time)}
    </span>
  );
};
