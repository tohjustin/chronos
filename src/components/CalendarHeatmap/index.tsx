import React from "react";

import Heatmap from "../Heatmap";
import { LegendConfiguration } from "../Heatmap/Legend";
import { CellConfiguration } from "../Heatmap/types";
import { MarginConfiguration } from "../types";

import CalendarHeatmapTooltip from "./Tooltip";
import { DateString, Datum } from "./types";
import { computeHeatmapData, formatDate } from "./utils";

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
  tooltipComponent?: React.FC<{ data: Datum }>;
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
      formatTick: formatTickY,
      tickValues: [1, 3, 5]
    },
    right: {
      enable: props.axis ? props.axis.right.enable : false,
      formatTick: formatTickY,
      tickValues: [1, 3, 5]
    },
    top: {
      enable: props.axis ? props.axis.top.enable : true,
      formatTick: formatTickX
    }
  };
  const heatmapLegend = {
    enable: props.legend ? props.legend.enable : true,
    expandToChartWidth: props.legend ? props.legend.expandToChartWidth : false,
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
  const HeatmapTooltipComponent =
    props.tooltipComponent || CalendarHeatmapTooltip;

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
        return props.data ? (
          <HeatmapTooltipComponent
            data={{
              day: formatDate(getDateFromDatum(props.data)),
              value: props.data.z || 0
            }}
          />
        ) : null;
      }}
    />
  );
};

export default CalendarHeatmap;
