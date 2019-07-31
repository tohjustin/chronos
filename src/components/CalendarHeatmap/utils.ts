import * as d3 from "d3";

import { Datum as HeatmapDatum } from "../Heatmap/types";

import { DateString, Datum } from "./types";

const formatDateString = d3.timeFormat("%Y-%m-%d");

export const parseDateString = (s: DateString): Date =>
  new Date(`${s} 00:00:00`);

export const formatDate = (date: Date) => formatDateString(date) as DateString;

const formatMonth = d3.timeFormat("%b");

const formatDayOfWeek = d3.timeFormat("%a");

export function computeHeatmapData(
  data: Datum[],
  startDay: DateString = data[0].day,
  endDay: DateString = data[data.length - 1].day
) {
  type ValueByDay = { [day: string]: number | null };

  const startDate = parseDateString(startDay);
  const endDate = parseDateString(endDay);
  const dataValueByDay = data.reduce((acc: ValueByDay, datum: Datum) => {
    acc[datum.day] = datum.value;
    return acc;
  }, {}) as ValueByDay;
  const heatmapData = [];

  // Always start on a Sunday & end on a Saturday
  const trueStartDate = d3.timeDay.offset(startDate, -1 * startDate.getDay());
  const trueEndDate = d3.timeDay.offset(endDate, 6 - endDate.getDay());
  const dayRange = d3.timeDay.count(trueStartDate, trueEndDate);
  const validDayRange = d3.timeDay.count(trueStartDate, new Date());

  for (let i = 0; i <= dayRange; i++) {
    const currentDate = d3.timeDay.offset(trueStartDate, i);
    const currentDay = formatDate(currentDate);

    heatmapData.push({
      x: Math.floor(i / 7),
      y: i % 7,
      z: i > validDayRange ? null : dataValueByDay[currentDay] || 0
    });
  }

  const getDateFromDatum = (datum: HeatmapDatum) =>
    d3.timeDay.offset(trueStartDate, datum.x * 7 + datum.y);

  // Compute axis tick formatters
  const formatTickX = (x: number) => {
    const firstDateOfWeek = getDateFromDatum({ x, y: 0, z: null });
    const lastDateOfWeek = getDateFromDatum({ x, y: 6, z: null });
    const monthOfFirstDayOfWeek = formatMonth(firstDateOfWeek);
    const monthOfLastDayOfWeek = formatMonth(lastDateOfWeek);
    const isFirstDayOfMonth = firstDateOfWeek.getDate() === 1;
    const hasMonthChange = monthOfFirstDayOfWeek != monthOfLastDayOfWeek;

    return isFirstDayOfMonth || hasMonthChange ? monthOfLastDayOfWeek : "";
  };
  const formatTickY = (y: number) => {
    return formatDayOfWeek(getDateFromDatum({ x: 0, y, z: null }));
  };

  return {
    heatmapData,
    getDateFromDatum,
    formatTickX,
    formatTickY
  };
}
