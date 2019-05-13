import * as d3 from "d3";
import { RootState } from "../../store/types";

function getDateInMs(timestamp: number): number {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

export function getIsLoadingRecords(state: RootState): boolean {
  return state.activity.isLoadingRecords;
}

export function getTotalDurationByDate(
  state: RootState
): { totalDuration: number; timestamp: number }[] {
  const totalDurationByDate: { [timestamp: string]: number } = {};

  state.activity.records.forEach(record => {
    let { startTime, endTime } = record;
    let [startDate, endDate] = [getDateInMs(startTime), getDateInMs(endTime)];

    // Handle records spanning over different dates
    while (startDate !== endDate) {
      const newEndTime = getDateInMs(endTime) - 1;

      const duration = endTime - newEndTime;
      const prevTotalDuration = totalDurationByDate[endDate] || 0;
      totalDurationByDate[endDate] = prevTotalDuration + duration;

      [endTime, endDate] = [newEndTime, getDateInMs(newEndTime)];
    }

    const duration = endTime - startTime;
    const prevTotalDuration = totalDurationByDate[endDate] || 0;
    totalDurationByDate[endDate] = prevTotalDuration + duration;
  });

  const [minDate, maxDate] = d3.extent(
    Object.keys(totalDurationByDate).map(Number)
  );
  if (minDate !== undefined && maxDate !== undefined) {
    let currentDate = minDate;
    while (currentDate < maxDate) {
      // Manually zero out days with no records
      if (totalDurationByDate[currentDate] === undefined) {
        totalDurationByDate[currentDate] = 0;
      }

      // Limit usage time up to maximum value of 24 hours
      if (totalDurationByDate[currentDate] > 0) {
        totalDurationByDate[currentDate] = Math.min(
          1000 * 60 * 60 * 24,
          totalDurationByDate[currentDate]
        );
      }

      currentDate += 1000 * 60 * 60 * 24;
    }
  }

  // Sort results by chronological order
  return Object.entries(totalDurationByDate)
    .map(([key, value]) => ({
      timestamp: Number(key),
      totalDuration: value
    }))
    .sort((a, b) => {
      return a.timestamp < b.timestamp ? -1 : 1;
    });
}

export function getTotalDurationByDomain(
  state: RootState
): { totalDuration: number; domain: string }[] {
  const totalDurationByDate: { [timestamp: string]: number } = {};

  state.activity.records.forEach(record => {
    let { origin: domain, startTime, endTime } = record;

    const duration = endTime - startTime;
    const prevTotalDuration = totalDurationByDate[domain] || 0;
    totalDurationByDate[domain] = prevTotalDuration + duration;
  });

  // Sort results by domains with highest duration
  return Object.entries(totalDurationByDate)
    .map(([key, value]) => ({
      domain: key,
      totalDuration: value
    }))
    .sort((a, b) => {
      return a.totalDuration > b.totalDuration ? -1 : 1;
    });
}
