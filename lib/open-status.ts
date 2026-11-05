// Open-now status from site.hours in the business's time zone (was js/status.js). Pure: used by the
// OpenStatus client leaf and, stringified, by its inline before-paint script.

export type StatusInput = {
  timeZone: string;
  days: number[];
  open: string;
  close: string;
  /** final strings, already translated on the server */
  text: { openUntil: string; opensAt: string; opensTomorrow: string };
};

export type Status = { open: boolean; text: string };

/** Must stay self-contained (no imports, no closures): it is also serialised into the inline script. */
export function computeStatus(input: StatusInput, now: Date = new Date()): Status {
  const ISO_WEEKDAY: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  const toMinutes = (hhmm: string) => {
    const [h = 0, m = 0] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: input.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ISO_WEEKDAY[part("weekday")] ?? 0;
  const minutes = Number(part("hour")) * 60 + Number(part("minute"));
  const openToday = input.days.includes(day);

  if (openToday && minutes >= toMinutes(input.open) && minutes < toMinutes(input.close)) {
    return { open: true, text: input.text.openUntil };
  }
  if (openToday && minutes < toMinutes(input.open)) return { open: false, text: input.text.opensAt };
  return { open: false, text: input.text.opensTomorrow };
}
