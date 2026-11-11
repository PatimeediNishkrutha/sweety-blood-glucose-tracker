export function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;
  return date;
}

export function todayUtcDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

export function getReportRange(type, selectedDate) {
  const date = parseDateOnly(selectedDate);
  if (!date) throw new Error("A valid date in YYYY-MM-DD format is required.");

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  let start;
  let end;

  if (type === "daily") {
    start = date;
    end = new Date(date.getTime() + 86400000);
  } else if (type === "month-to-date") {
    start = new Date(Date.UTC(year, month, 1));
    end = new Date(date.getTime() + 86400000);
  } else if (type === "monthly") {
    start = new Date(Date.UTC(year, month - 1, 1));
    end = new Date(Date.UTC(year, month, 1));
  } else {
    throw new Error("Unsupported report type.");
  }

  return { start, end };
}
