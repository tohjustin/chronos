import React, { useCallback, useMemo, useState } from "react";

import { useClientDimensions } from "../../hooks";
import Axis, { AxisConfiguration } from "../Axis";
import Grid, { GridConfiguration } from "../Grid";
import TooltipRenderer from "../TooltipRenderer";
import { MarginConfiguration } from "../types";

import Chart from "./Chart";
import Cursor from "./Cursor";
import HoverOverlay from "./HoverOverlay";
import { Datum } from "./types";
import { computeSizes } from "./utils";

import "./styles.scss";

interface LineChartProps {
  /**
   * NOTE: component does not support negative values
   */
  data: Datum[];

  axis?: AxisConfiguration<number, number>;
  grid?: GridConfiguration<number, number>;
  isInteractive?: boolean;
  margin?: MarginConfiguration;
  /**
   * NOTE: component does not support negative values
   */
  maxValue?: number;
  /**
   * NOTE: component does not support negative values
   */
  minValue?: number;
  transitionDelay?: number;
  tooltipComponent?: React.FC<{ data: Datum | null }>;
}

const TOOLTIP_MARGIN = 8;

export const defaultProps = {
  axis: {
    bottom: { enable: true, showDomain: true },
    left: { enable: true, showDomain: true },
    right: { enable: true, showDomain: true },
    top: { enable: true, showDomain: true }
  },
  grid: {
    horizontal: { enable: true },
    vertical: { enable: true }
  },
  isInteractive: true,
  margin: { top: 0, left: 40, bottom: 24, right: 8 },
  transitionDelay: 500
};

const LineChart = ({
  axis = defaultProps.axis,
  data,
  grid = defaultProps.grid,
  isInteractive = defaultProps.isInteractive,
  margin = defaultProps.margin,
  maxValue,
  minValue,
  tooltipComponent,
  transitionDelay = defaultProps.transitionDelay
}: LineChartProps) => {
  const [
    containerRef,
    { height: containerHeight, width: containerWidth }
  ] = useClientDimensions();
  const [hoveredDatum, setHoveredDatum] = useState<Datum | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const {
    chartHeight,
    chartWidth,
    scaleX,
    scaleY,
    svgHeight,
    svgWidth
  } = useMemo(
    () =>
      computeSizes({
        containerHeight,
        containerWidth,
        data,
        margin,
        maxValue,
        minValue
      }),
    [containerHeight, containerWidth, data, margin, maxValue, minValue]
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseOver = useCallback((datum: Datum | null) => {
    setIsHovering(true);
    setHoveredDatum(datum);
  }, []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  let marginX = 0;
  let marginY = 0;
  let hoverX: number | null = null;
  let hoverY: number | null = null;
  if (isInteractive && hoveredDatum) {
    hoverX = (scaleX(hoveredDatum.x) || 0) + margin.left;
    hoverY = (scaleY(hoveredDatum.y) || 0) + margin.top;
    marginX = TOOLTIP_MARGIN;
    marginY = TOOLTIP_MARGIN;
  }

  return (
    <div className="line-chart" ref={containerRef}>
      {chartHeight !== 0 && chartWidth !== 0 && (
        <div className="line-chart__container">
          <svg height={svgHeight} width={svgWidth}>
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              <Grid
                {...grid}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
              <Axis
                {...axis}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
              <Chart
                data={data}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
                transitionDelay={transitionDelay}
              />
            </g>
            {isInteractive && (
              <Cursor
                isHovering={isHovering}
                x={hoverX}
                y={hoverY}
                height={chartHeight}
                width={chartWidth}
              />
            )}
          </svg>
          {isInteractive && (
            <HoverOverlay
              data={data}
              height={chartHeight}
              width={chartWidth}
              onMouseOver={handleMouseOver}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              marginX={margin.left}
              marginY={margin.top}
              scaleX={scaleX}
              scaleY={scaleY}
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
              x={hoverX}
              y={hoverY}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LineChart;
