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

export const defaultProps = {
  axis: {
    bottom: { enable: false, showDomain: false },
    left: { enable: true, showDomain: false },
    right: { enable: false, showDomain: false },
    top: { enable: true, showDomain: false }
  },
  cell: {
    forceSquare: true,
    marginRatio: 0.2,
    radius: 0
  },
  legend: {
    enable: false,
    expandToChartWidth: false,
    includeEmptyColor: true,
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    formatLabels: null,
    sideLabels: null
  },
  isInteractive: true,
  margin: { left: 0, right: 0, top: 0, bottom: 0 }
};

const Heatmap = ({
  axis = defaultProps.axis,
  cell = defaultProps.cell,
  colorRange,
  data,
  isInteractive = defaultProps.isInteractive,
  legend = defaultProps.legend,
  margin = defaultProps.margin,
  thresholds,
  tooltipComponent
}: HeatmapProps) => {
  const [
    containerRef,
    { height: containerHeight, width: containerWidth }
  ] = useClientDimensions();
  const [hoveredDatum, setHoveredDatum] = useState<Datum | null>(null);
  const [isHovering, setIsHovering] = useState(false);

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
  if (isInteractive && hoveredDatum) {
    const cellOffsetX = cellWidth / 2;
    const cellOffsetY = cellHeight / 2;

    // (hoverX, hoverY) === center of heatmap cell
    hoverX = (scaleX(hoveredDatum.x) || 0) + cellOffsetX + margin.left;
    hoverY = (scaleY(hoveredDatum.y) || 0) + cellOffsetY + margin.top;
    marginX = cellOffsetX + cellSpacingX / 2;
    marginY = cellOffsetY + cellSpacingY / 2;
  }

  return (
    <div className="heatmap" ref={containerRef}>
      {chartHeight !== 0 && chartWidth !== 0 && (
        <div className="heatmap__container">
          <svg height={svgHeight} width={svgWidth}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <MemoizedChart
                cell={cell}
                data={data}
                isInteractive={isInteractive}
                onMouseOver={handleMouseOver}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                scaleX={scaleX}
                scaleY={scaleY}
                scaleZ={scaleZ}
              />
              <MemoizedAxis
                {...axis}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
            </g>
          </svg>
          {legend.enable && (
            <MemoizedLegend
              cellHeight={cellHeight}
              cellWidth={cellWidth}
              cellRadius={cell.radius}
              cellSpacing={cellSpacingX}
              chartWidth={chartWidth}
              colors={colors}
              legend={legend}
              thresholds={thresholds}
            />
          )}
          {isInteractive && (
            <TooltipRenderer
              data={hoveredDatum}
              component={tooltipComponent}
              height={containerHeight}
              width={containerWidth}
              isHovering={isHovering}
              marginX={marginX}
              marginY={marginY}
              offsetX={offsetX}
              offsetY={offsetY}
              x={hoverX}
              y={hoverY}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Heatmap;
