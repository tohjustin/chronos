/**
 * Converts a date object into human-readable format for tooltips
 * @param {number} date Date object
 * @returns {string} date in human-readable format
 */
export function formatTooltipDateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric"
  });
}

/**
 * Converts a duration into human-readable format for tooltips
 * @param {number} duration duration in milliseconds
 * @returns {string} duration in human-readable format
 */
export function formatTooltipDurationLabel(duration: number): string {
  const durationInMins = Math.round(duration / 1000 / 60);
  const minutes = Math.floor(durationInMins) % 60;
  const hours = Math.floor(durationInMins / 60);

  let result = "";
  switch (true) {
    case hours > 0:
      result += `${hours} ${hours > 1 ? "hours" : "hour"} `;
    case minutes > 0:
      result += `${minutes} ${minutes > 1 ? "minutes" : "minute"}`;
      return result;
    case duration > 0: {
      const seconds = Math.round(duration / 1000);
      return `${seconds} ${seconds > 1 ? "seconds" : "second"}`;
    }
    default:
      return "No activity";
  }
}
