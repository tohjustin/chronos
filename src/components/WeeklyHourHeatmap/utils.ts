import { formatDayOfWeek, formatHourOfDay } from "../../utils/stringUtils";

import { Datum } from "./types";

export function computeHeatmapData(data: Datum[]) {
  const heatmapData = data.map(datum => ({
    x: datum.day,
    y: datum.hour,
    z: datum.value
  }));

  // Compute axis tick formatters
  const formatTickX = (x: number) => {
    return formatDayOfWeek(x)[0].toUpperCase();
  };
  const formatTickY = (y: number) => {
    return [0, 3, 6, 9, 12, 15, 18, 21].includes(y) ? formatHourOfDay(y) : "";
  };

  return {
    heatmapData,
    formatTickX,
    formatTickY
  };
}
