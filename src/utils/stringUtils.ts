/**
 * Converts day of week into human-readable format
 * @param day number of days elapsed since start of week
 * @returns `""` if `day` is out of bounds, otherwise day of week in
 * human-readable format
 */
export function formatDayOfWeek(day: number): string {
  if (day < 0 || day >= 7) {
    return "";
  }

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

/**
 * Converts hours into human-readable format
 * @param hour number of hours elapsed since start of day
 * @returns `""` if `day` is out of bounds, otherwise hour of day in
 * human-readable format
 */
export function formatHourOfDay(hour: number): string {
  if (hour < 0 || hour > 24) {
    return "";
  }
  if (hour === 0 || hour === 24) {
    return "12 am";
  }
  if (hour === 12) {
    return "12 pm";
  }

  return hour > 12 ? `${hour - 12} pm` : `${hour} am`;
}

/**
 * Converts a date object into human-readable format for Tables
 * @param date Date object
 * @returns date in human-readable format
 */
export function formatTableDateTimeLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    day: "numeric"
  });
}

/**
 * Converts a duration into human-readable format for Tables
 * @param duration duration in milliseconds
 * @returns duration in human-readable format
 */
export function formatTableDurationLabel(duration: number): string {
  if (duration < 1000) {
    return `${duration} ms`;
  }

  if (duration < 60000) {
    return `${(duration / 1000).toFixed(1)} s`;
  }

  if (duration < 3600000) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.round((duration / 1000) % 60);
    return `${minutes} min ${seconds.toString().padStart(2, "0")} s`;
  }

  const hours = Math.floor(duration / 3600000);
  const minutes = Math.round((duration / 60000) % 60);
  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

/**
 * Converts a date object into human-readable format for tooltips
 * @param date Date object
 * @returns date in human-readable format
 */
export function formatTooltipDateLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric"
  });
}

/**
 * Converts day of week into human-readable format for tooltips
 * @param day number of days elapsed since start of week
 * @returns `""` if `day` is out of bounds, otherwise day of week in
 * human-readable format
 */
export function formatTooltipDayOfWeekLabel(day: number): string {
  return formatDayOfWeek(day);
}

/**
 * Converts a duration into human-readable format for tooltips
 * @param duration duration in milliseconds
 * @returns duration in human-readable format
 */
export function formatTooltipDurationLabel(duration: number): string {
  // Round up to nearest minutes
  const durationInMins = Math.round(duration / 1000 / 60);
  const minutes = Math.floor(durationInMins) % 60;
  const hours = Math.floor(durationInMins / 60);

  let result = "";
  if (hours > 0) {
    result += `${hours} ${hours > 1 ? "hours" : "hour"}`;
  }
  if (minutes > 0) {
    result += ` ${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }
  if (result !== "") {
    return result.trim();
  }

  const durationInSecs = Math.floor(duration / 1000);
  return durationInSecs > 0
    ? `${durationInSecs} ${durationInSecs > 1 ? "seconds" : "second"}`
    : "No activity";
}

/**
 * Converts hour-of-week into human-readable format for tooltips
 * @param day number of days elapsed since start of week
 * @param hour number of hours elapsed since start of day
 * @returns hour-of-week value in human-readable format
 */
export function formatTooltipHourOfWeekLabel(
  dayOfWeek: number,
  hourOfDay: number
): string {
  return `${formatDayOfWeek(dayOfWeek)}, ${formatHourOfDay(hourOfDay)}`;
}
