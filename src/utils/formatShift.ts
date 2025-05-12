export function formatShift(shift: { startDate: string; endDate: string }) {
  const start = new Date(shift.startDate);
  const end = new Date(shift.endDate);
  return `${start.toLocaleString("en-US", { month: "short", day: "numeric", weekday: "short" })} ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} PDT`;
}
