import React from "react";

import { BASE_SIZE } from "../../styles/constants";
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

export const defaultProps = {
  cell: {
    forceSquare: false,
    marginRatio: 0.35,
    radius: 0
  },
  isInteractive: true,
  legend: {
    enable: true,
    expandToChartWidth: true,
    formatLabels: (threshold: number) => `${threshold}`,
    includeEmptyColor: false,
    margin: { left: 0, right: BASE_SIZE * 0.5, top: 0, bottom: BASE_SIZE },
    sideLabels: null
  },
  margin: {
    left: BASE_SIZE * 6,
    right: BASE_SIZE * 0.5,
    top: BASE_SIZE * 0.5,
    bottom: BASE_SIZE * 6.5
  },
  tooltipComponent: WeeklyHourHeatmapTooltip
};

const WeeklyHourHeatmap = ({
  axis,
  cell = defaultProps.cell,
  colorRange,
  data,
  isInteractive = defaultProps.isInteractive,
  legend = defaultProps.legend,
  margin = defaultProps.margin,
  thresholds,
  tooltipComponent: HeatmapTooltipComponent = defaultProps.tooltipComponent
}: WeeklyHourHeatmapProps) => {
  const { heatmapData, formatTickX, formatTickY } = computeHeatmapData(data);
  const heatmapAxis = {
    bottom: {
      enable: axis ? axis.bottom.enable : true,
      showDomain: false,
      formatTick: formatTickX
    },
    left: {
      enable: axis ? axis.left.enable : true,
      showDomain: false,
      formatTick: formatTickY
    },
    right: {
      enable: axis ? axis.right.enable : false,
      showDomain: false,
      formatTick: formatTickY
    },
    top: {
      enable: axis ? axis.top.enable : false,
      showDomain: false,
      formatTick: formatTickX
    }
  };

  return (
    <Heatmap
      axis={heatmapAxis}
      cell={cell}
      colorRange={colorRange}
      data={heatmapData}
      isInteractive={isInteractive}
      legend={legend}
      margin={margin}
      thresholds={thresholds}
      tooltipComponent={props =>
        props.data && (
          <HeatmapTooltipComponent
            data={{
              day: props.data.x,
              hour: props.data.y,
              value: props.data.z
            }}
          />
        )
      }
    />
  );
};

export default WeeklyHourHeatmap;
