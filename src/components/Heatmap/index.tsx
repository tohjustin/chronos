import React, { useState } from "react";

import { useClientDimensions } from "../../hooks";
import Axis, { AxisConfiguration, AxisProps } from "../Axis";
import TooltipRenderer from "../TooltipRenderer";
import { MarginConfiguration } from "../types";

import Chart from "./Chart";
import Legend, { LegendConfiguration } from "./Legend";
import { CellConfiguration, Datum } from "./types";
import { computeColors, computeSizes } from "./utils";

import "./styles.scss";

const MemoizedAxis = React.memo<AxisProps<number, number>>(Axis);
const MemoizedChart = React.memo(Chart);
const MemoizedLegend = React.memo(Legend);

interface HeatmapProps {
  data: Datum[];
  colorRange: [string, string];
  thresholds: number[];

  axis: AxisConfiguration<number, number>;
  cell: CellConfiguration;
  isInteractive: boolean;
  legend: LegendConfiguration;
  margin: MarginConfiguration;
  tooltipComponent?: React.FC<{ data: Datum | null }>;
}

const formatTick = (value: number) => `${value}`;
const defaultProps = {
  axis: {
    bottom: { enable: false, formatTick },
    left: { enable: true, formatTick },
    right: { enable: false, formatTick },
    top: { enable: true, formatTick }
  },
  cell: {
    forceSquare: true,
    marginRatio: 0.2,
    radius: 0
  },
  legend: {
    enable: false,
    expandToChartWidth: true,
    includeEmptyColor: true,
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    formatLabels: null,
    sideLabels: null
  },
  isInteractive: true,
  margin: { left: 0, right: 0, top: 0, bottom: 0 }
};

const Heatmap = (props: HeatmapProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();
  const [hoveredDatum, setHoveredDatum] = useState<Datum | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const { data, cell, colorRange, margin, thresholds } = props;
  const {
    cellHeight,
    cellSpacingX,
    cellSpacingY,
    cellWidth,
    chartHeight,
    chartWidth,
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    svgHeight,
    svgWidth
  } = React.useMemo(
    () => computeSizes({ cell, containerHeight, containerWidth, data, margin }),
    [data, containerHeight, containerWidth, cell, margin]
  );
  const { colors, scaleZ } = React.useMemo(
    () => computeColors(colorRange, thresholds),
    [colorRange, thresholds]
  );

  const handleMouseEnter = React.useCallback(() => setIsHovering(true), []);
  const handleMouseOver = React.useCallback(setHoveredDatum, []);
  const handleMouseLeave = React.useCallback(() => setIsHovering(false), []);

  let marginX = 0;
  let marginY = 0;
  let hoverX = null;
  let hoverY = null;
  if (props.isInteractive && hoveredDatum) {
    const cellOffsetX = cellWidth / 2;
    const cellOffsetY = cellHeight / 2;

    // (hoverX, hoverY) === center of heatmap cell
    hoverX = (scaleX(hoveredDatum.x) || 0) + cellOffsetX + props.margin.left;
    hoverY = (scaleY(hoveredDatum.y) || 0) + cellOffsetY + props.margin.top;
    marginX = cellOffsetX + cellSpacingX / 2;
    marginY = cellOffsetY + cellSpacingY / 2;
  }

  return (
    <div className="heatmap" ref={containerRef}>
      {chartHeight !== 0 && chartWidth !== 0 && (
        <div className="heatmap__container">
          <svg height={svgHeight} width={svgWidth}>
            <g
              transform={`translate(${props.margin.left}, ${props.margin.top})`}
            >
              <MemoizedChart
                cell={props.cell}
                data={props.data}
                isInteractive={props.isInteractive}
                onMouseOver={handleMouseOver}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                scaleX={scaleX}
                scaleY={scaleY}
                scaleZ={scaleZ}
              />
              <MemoizedAxis
                {...props.axis}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
            </g>
          </svg>
          {props.legend.enable && (
            <MemoizedLegend
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              cellRadius={props.cell.radius}
              cellSpacing={cellSpacingX}
              chartWidth={chartWidth}
              colors={colors}
              legend={props.legend}
              thresholds={thresholds}
            />
          )}
          {props.isInteractive && (
            <TooltipRenderer
              data={hoveredDatum}
              component={props.tooltipComponent}
              height={containerHeight}
              width={containerWidth}
              isHovering={isHovering}
              marginX={marginX}
              marginY={marginY}
              offsetX={offsetX}
              offsetY={offsetY}
              x={hoverX ? hoverX : null}
              y={hoverY ? hoverY : null}
            />
          )}
        </div>
      )}
    </div>
  );
};

Heatmap.defaultProps = defaultProps;

export default Heatmap;
