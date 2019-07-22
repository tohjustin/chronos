import React from "react";

import { MarginConfiguration } from "../types";

export type LegendConfiguration = {
  enable: boolean;
  includeEmptyColor: boolean;
  margin: MarginConfiguration;
};

interface LegendProps {
  cellHeight: number;
  cellRadius: number;
  cellSpacing: number;
  cellWidth: number;
  colors: d3.ColorCommonInstance[];
  legend: LegendConfiguration;
}

const Legend = (props: LegendProps) => {
  const cellMargin = props.cellSpacing / 2;
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
      <div className="heatmap__legend-label">Less</div>
      <div
        className="heatmap__legend-cells"
        style={{
          marginLeft: `${props.cellSpacing}px`,
          marginRight: `${props.cellSpacing}px`
        }}
      >
        {colors.map((color, index) => {
          const x =
            index * (props.cellWidth + props.cellSpacing) + props.cellSpacing;

          return (
            <div
              key={`${x}_${color}`}
              style={{
                borderRadius: props.cellRadius,
                backgroundColor: `${color}`,
                height: props.cellHeight,
                width: props.cellWidth,
                marginLeft: `${cellMargin}px`,
                marginRight: `${cellMargin}px`
              }}
            ></div>
          );
        })}
      </div>
      <div className="heatmap__legend-label">More</div>
    </div>
  );
};

export default Legend;
