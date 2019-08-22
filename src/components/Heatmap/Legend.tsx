import React from "react";

import { MarginConfiguration } from "../types";

export type LegendConfiguration = {
  enable: boolean;
  expandToChartWidth: boolean;
  includeEmptyColor: boolean;
  margin: MarginConfiguration;
  formatLabels: ((threshold: number) => string) | null;
  sideLabels: [string, string] | null;
};

interface LegendProps {
  cellHeight: number;
  cellRadius: number;
  cellSpacing: number;
  cellWidth: number;
  chartWidth: number;
  colors: d3.ColorCommonInstance[];
  legend: LegendConfiguration;
  thresholds: number[];
}

function computeCellWidth({
  colors,
  cellWidth,
  cellSpacing,
  chartWidth,
  legend
}: {
  colors: d3.ColorCommonInstance[];
  cellWidth: number;
  cellSpacing: number;
  chartWidth: number;
  legend: LegendConfiguration;
}) {
  if (legend.expandToChartWidth) {
    const cellCount = legend.includeEmptyColor
      ? colors.length
      : colors.length - 1;
    const width = (chartWidth - (cellCount - 1) * cellSpacing) / cellCount;
    return width;
  }

  return cellWidth;
}

const Legend = (props: LegendProps) => {
  const cellWidth = computeCellWidth(props);
  const colors = props.legend.includeEmptyColor
    ? props.colors
    : props.colors.slice(1);

  return (
    <div
      className="heatmap__legend"
      style={{
        height: `${props.cellHeight}px`,
        marginTop: `${props.legend.margin.top}px`,
        marginRight: `${props.legend.margin.right}px`,
        marginBottom: `${props.legend.margin.bottom}px`,
        marginLeft: `${props.legend.margin.left}px`
      }}
    >
      {props.legend.sideLabels && (
        <div className="heatmap__legend-label">
          {props.legend.sideLabels[0]}
        </div>
      )}
      <div
        className="heatmap__legend-cells"
        style={
          props.legend.sideLabels
            ? {
                marginLeft: `${props.cellSpacing}px`,
                marginRight: `${props.cellSpacing}px`
              }
            : {}
        }
      >
        {colors.map((color, index) => {
          const isLastCell = index === colors.length - 1;
          const threshold =
            props.thresholds[
              props.legend.includeEmptyColor ? index : index + 1
            ];

          return (
            <div key={color.toString()}>
              <div
                className="heatmap__legend-cell"
                style={{
                  borderRadius: props.cellRadius,
                  backgroundColor: `${color}`,
                  height: props.cellHeight,
                  width: cellWidth,
                  marginRight: `${isLastCell ? 0 : props.cellSpacing}px`
                }}
              ></div>
              {props.legend.formatLabels && (
                <div className="heatmap__legend-label">
                  {props.legend.formatLabels(threshold)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {props.legend.sideLabels && (
        <div className="heatmap__legend-label">
          {props.legend.sideLabels[1]}
        </div>
      )}
    </div>
  );
};

export default Legend;
