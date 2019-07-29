import React from "react";

import Heatmap from "../Heatmap";
import { LegendConfiguration } from "../Heatmap/Legend";
import { CellConfiguration } from "../Heatmap/types";
import { MarginConfiguration } from "../types";

import WeeklyHourHeatmapTooltip from "./Tooltip";
import { Datum } from "./types";
import { computeHeatmapData } from "./utils";

interface WeeklyHourHeatmapProps {
  data: Datum[];
  colorRange: [string, string];
  thresholds: number[];

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
  tooltipComponent?: React.FC<{ data: Datum }>;
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
  const HeatmapTooltipComponent =
    props.tooltipComponent || WeeklyHourHeatmapTooltip;

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
        return props.data ? (
          <HeatmapTooltipComponent
            data={{
              day: props.data.x,
              hour: props.data.y,
              value: props.data.z
            }}
          />
        ) : null;
      }}
    />
  );
};

export default WeeklyHourHeatmap;
