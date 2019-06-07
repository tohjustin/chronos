/**
 * Converts number of days into human-readable format
 * @param {number} day number of days elapsed since start of week
 * @returns {string} `""` if `day` is out of bounds, otherwise day of week in
 * human-readable format
 */
export function formatDayOfWeek(day: number): string {
  if (day < 0 || day >= 7) {
    return "";
  }

  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
}

/**
 * Converts duration into human-readable format
 * @param {number} duration duration in milliseconds
 * @returns {string} `""` if `day` is negative, otherwise duration in
 * human-readable format
 */
export function formatDuration(duration: number): string {
  const durationInMins = Math.round(duration / 1000 / 60);
  const minutes = Math.floor(durationInMins) % 60;
  const hours = Math.floor(durationInMins / 60);
  let result = "";

  if (hours > 0) {
    result += `${hours} ${hours > 1 ? "hours" : "hour"} `;
  }
  if (minutes > 0) {
    result += `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
  }
  if (durationInMins !== 0 && hours === 0 && minutes === 0) {
    result += "Less than 1 minute";
  }
  if (durationInMins === 0) {
    result += "No activity";
  }

  return result;
}

/**
 * Converts hours into human-readable format
 * @param {number} hour number of hours elapsed since start of day
 * @returns {string} `""` if `day` is out of bounds, otherwise hour of day in
 * human-readable format
 */
export function formatHourOfDay(hour: number): string {
  if (hour < 0 || hour > 24) {
    return "";
  }
  if (hour === 0 || hour === 24) {
    return "12 am";
  }

  return hour > 12 ? `${hour - 12} pm` : `${hour} am`;
}
