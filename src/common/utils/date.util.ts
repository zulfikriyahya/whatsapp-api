import { format, isAfter, startOfDay, startOfMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Asia/Jakarta";

export function nowWIB(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

export function isSameDay(a: Date, b: Date): boolean {
  return format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd");
}

export function isSameMonth(a: Date, b: Date): boolean {
  return format(a, "yyyy-MM") === format(b, "yyyy-MM");
}

export function isFuture(date: Date): boolean {
  return isAfter(date, new Date());
}

export function nextRecurrence(date: Date, type: string): Date {
  const d = new Date(date);
  if (type === "daily") d.setDate(d.getDate() + 1);
  else if (type === "weekly") d.setDate(d.getDate() + 7);
  else if (type === "monthly") d.setMonth(d.getMonth() + 1);
  return d;
}
