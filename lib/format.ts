/** Shared display formatting for money and dates coming back from the API. */

export function toNumber(value: string | number | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function currency(value: string | number | null | undefined) {
  return `GH₵ ${toNumber(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Short label like "Today", "Yesterday", "16 Sep" for a transaction date. */
export function shortDate(value?: string | null) {
  if (!value) return "Today";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Today";

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((startOfToday - startOfDate) / dayMs);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}
