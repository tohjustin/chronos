import React, { useCallback, useMemo, useState } from "react";

import { useClientDimensions } from "../../hooks";
import { BASE_SIZE, CHART_TRANSITION_DELAY } from "../../styles/constants";
import Axis, { AxisConfiguration } from "../Axis";
import Grid, { GridConfiguration } from "../Grid";
import TooltipRenderer from "../TooltipRenderer";
import { MarginConfiguration } from "../types";

import Chart from "./Chart";
import { Datum } from "./types";
import { computeSizes } from "./utils";

import "./styles.scss";

interface VerticalBarChartProps {
  /**
   * NOTE: component does not support negative values
   */
  data: Datum[];

  axis?: AxisConfiguration<number, number>;
  grid?: GridConfiguration<number, number>;
  isInteractive?: boolean;
  margin?: MarginConfiguration;
  transitionDelay?: number;
  /**
   * NOTE: component does not support negative values
   */
  maxValue?: number;
  /**
   * NOTE: component does not support negative values
   */
  minValue?: number;
  tooltipComponent?: React.FC<{ data: Datum | null }>;
}

const TOOLTIP_MARGIN = BASE_SIZE * 0.5;

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
  margin: { left: BASE_SIZE * 4.5, right: 0, top: 0, bottom: BASE_SIZE * 3 },
  transitionDelay: CHART_TRANSITION_DELAY
};

const VerticalBarChart = ({
  axis = defaultProps.axis,
  data,
  grid = defaultProps.grid,
  isInteractive = defaultProps.isInteractive,
  margin = defaultProps.margin,
  maxValue,
  minValue,
  tooltipComponent,
  transitionDelay = defaultProps.transitionDelay
}: VerticalBarChartProps) => {
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
  const handleMouseOver = useCallback(setHoveredDatum, []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  let marginX = 0;
  let marginY = 0;
  let hoverX = null;
  let hoverY = null;
  if (isInteractive && hoveredDatum) {
    // (hoverX, hoverY) === top + middle point of bar
    hoverX =
      (scaleX(hoveredDatum.x) || 0) + margin.left + scaleX.bandwidth() / 2;
    hoverY = (scaleY(hoveredDatum.y) || 0) + margin.top;
    marginX = TOOLTIP_MARGIN + scaleX.bandwidth() / 2;
    marginY = TOOLTIP_MARGIN;
  }

  return (
    <div className="vertical-bar-chart" ref={containerRef}>
      {chartHeight !== 0 && chartWidth !== 0 && (
        <div className="vertical-bar-chart__container">
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
                isInteractive={isInteractive}
                onMouseOver={handleMouseOver}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                scaleX={scaleX}
                scaleY={scaleY}
                transitionDelay={transitionDelay}
              />
            </g>
          </svg>
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

export default VerticalBarChart;
