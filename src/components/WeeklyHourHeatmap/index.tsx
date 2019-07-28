import React from "react";

import {
  formatDayOfWeek,
  formatHourOfDay,
  formatTooltipDurationLabel,
  formatTooltipHourOfWeekLabel
} from "../../utils/stringUtils";

import Heatmap from "../Heatmap";
import { Datum as HeatmapDatum } from "../Heatmap/types";
import { LegendConfiguration } from "../Heatmap/Legend";
import { CellConfiguration } from "../Heatmap/types";
import Tooltip from "../Tooltip";
import { MarginConfiguration } from "../types";

type Datum = {
  day: number;
  hour: number;
  value: number;
};

interface WeeklyHourHeatmapProps {
  data: Datum[];
  colorRange: [string, string];
  thresholds: number[];

  // optional
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

function computeHeatmapData(data: Datum[]) {
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

const MARGIN = { left: 48, right: 4, top: 4, bottom: 52 };

const WeeklyHourHeatmap = (props: WeeklyHourHeatmapProps) => {
  const { heatmapData, formatTickX, formatTickY } = computeHeatmapData(
    props.data
  );
  const heatmapAxis = {
    bottom: {
      enable: props.axis ? props.axis.bottom.enable : true,
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
      enable: props.axis ? props.axis.top.enable : false,
      formatTick: formatTickX
    }
  };
  const heatmapCell = {
    forceSquare: props.cell ? props.cell.forceSquare : false,
    marginRatio: props.cell ? props.cell.marginRatio : 0.35,
    radius: props.cell ? props.cell.radius : 0
  };
  const heatmapLegend = {
    enable: props.legend ? props.legend.enable : true,
    expandToChartWidth: props.legend ? props.legend.expandToChartWidth : false,
    formatLabels: props.legend
      ? props.legend.formatLabels
      : (threshold: number) => `${threshold / 1000 / 60}m`,
    includeEmptyColor: props.legend ? props.legend.includeEmptyColor : false,
    margin: props.legend
      ? props.legend.margin
      : { left: 0, right: 0, top: 0, bottom: 8 },
    sideLabels: props.legend ? props.legend.sideLabels : null
  };
  const heatmapMargin = props.margin || MARGIN;

  return (
    <Heatmap
      axis={heatmapAxis}
      cell={heatmapCell}
      colorRange={props.colorRange}
      data={heatmapData}
      isInteractive={props.isInteractive}
      legend={heatmapLegend}
      margin={heatmapMargin}
      thresholds={props.thresholds}
      tooltipComponent={props => {
        const datum = props.data || { x: 0, y: 0, z: 0 };
        const { x: day, y: hour, z: time } = datum;
        const dateString = formatTooltipHourOfWeekLabel(day, hour);
        const duration = formatTooltipDurationLabel(time || 0);

        return <Tooltip header={dateString} body={duration} />;
      }}
    />
  );
};

export default WeeklyHourHeatmap;
