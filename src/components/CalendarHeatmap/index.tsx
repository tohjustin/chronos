import * as d3 from "d3";
import React from "react";

import {
  formatTooltipDateLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";
import { Opaque } from "../../utils/typeUtils";

import Heatmap from "../Heatmap";
import { Datum as HeatmapDatum } from "../Heatmap/types";
import { LegendConfiguration } from "../Heatmap/Legend";
import { CellConfiguration } from "../Heatmap/types";
import Tooltip from "../Tooltip";
import { MarginConfiguration } from "../types";

type DateString = Opaque<"DATE_STRING:YYYY-MM-DD", string>;

type Datum = {
  day: DateString;
  value: number;
};

interface CalendarHeatmapProps {
  data: Datum[];
  colorRange: [string, string];
  thresholds: number[];

  startDay?: DateString;
  endDay?: DateString;
  axis?: {
    bottom: { enable: boolean };
    left: { enable: boolean };
    right: { enable: boolean };
    top: { enable: boolean };
  };
  cell?: CellConfiguration;
  isInteractive?: boolean;
  legend?: LegendConfiguration;
  margin?: MarginConfiguration;
  tooltipComponent?: React.FC<{ data: HeatmapDatum | null }>;
}

const formatDateString = d3.timeFormat("%Y-%m-%d");
export const formatDate = (date: Date) => formatDateString(date) as DateString;
export const formatMonth = d3.timeFormat("%b");
export const formatDayOfWeek = d3.timeFormat("%a");
function computeHeatmapData(
  data: Datum[],
  startDay: DateString = data[0].day,
  endDay: DateString = data[data.length - 1].day
) {
  type ValueByDay = { [day: string]: number };

  const startDate = new Date(startDay);
  const endDate = new Date(endDay);
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

  for (let i = 0; i < dayRange; i++) {
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
    return [1, 3, 5].includes(y)
      ? formatDayOfWeek(getDateFromDatum({ x: 0, y, z: null }))
      : "";
  };

  return {
    heatmapData,
    getDateFromDatum,
    formatTickX,
    formatTickY
  };
}

const MARGIN = { left: 40, right: 8, top: 24, bottom: 32 };

const CalendarHeatmap = (props: CalendarHeatmapProps) => {
  const {
    heatmapData,
    getDateFromDatum,
    formatTickX,
    formatTickY
  } = computeHeatmapData(props.data, props.startDay, props.endDay);
  const heatmapAxis = {
    bottom: {
      enable: props.axis ? props.axis.bottom.enable : false,
      formatTick: formatTickX
    },
    left: {
      enable: props.axis ? props.axis.left.enable : true,
      formatTick: formatTickY
    },
    right: {
      enable: props.axis ? props.axis.right.enable : false,
      formatTick: formatTickY
    },
    top: {
      enable: props.axis ? props.axis.top.enable : true,
      formatTick: formatTickX
    }
  };
  const heatmapLegend = {
    enable: props.legend ? props.legend.enable : true,
    expandToChartWidth: props.legend ? props.legend.expandToChartWidth : true,
    formatLabels: props.legend ? props.legend.formatLabels : null,
    includeEmptyColor: props.legend ? props.legend.includeEmptyColor : true,
    margin: props.legend
      ? props.legend.margin
      : { left: 8, right: 8, top: 0, bottom: 0 },
    sideLabels: props.legend
      ? props.legend.sideLabels
      : (["Less", "More"] as [string, string])
  };
  const heatmapMargin = props.margin || MARGIN;

  return (
    <Heatmap
      axis={heatmapAxis}
      cell={props.cell}
      colorRange={props.colorRange}
      data={heatmapData}
      isInteractive={props.isInteractive}
      legend={heatmapLegend}
      margin={heatmapMargin}
      thresholds={props.thresholds}
      tooltipComponent={props => {
        const datum = props.data || { x: 0, y: 0, z: 0 };
        const dateString = formatTooltipDateLabel(getDateFromDatum(datum));
        const duration = formatTooltipDurationLabel(datum.z || 0);

        return <Tooltip header={dateString} body={duration} />;
      }}
    />
  );
};

export default CalendarHeatmap;
