// utils/formatTime.ts

import { Clock } from "lucide-react";

/**
 * Convert time string "HH:MM" into Persian format like "12 ساعت و 30 دقیقه"
 * @param time - time in "HH:MM" format
 * @returns string in Persian format
 */
const formatTime = (time: string): string => {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return "";

  const [hours, minutes] = time.split(":").map(Number);

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
