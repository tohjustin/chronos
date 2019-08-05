import React, { useState } from "react";

import { useClientDimensions } from "../../hooks";
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

  axis: AxisConfiguration<number, number>;
  grid: GridConfiguration<number, number>;
  isInteractive: boolean;
  margin: MarginConfiguration;
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

const defaultProps = {
  axis: {
    bottom: { enable: true },
    left: { enable: true },
    right: { enable: true },
    top: { enable: true }
  },
  grid: {
    horizontal: { enable: true },
    vertical: { enable: true }
  },
  isInteractive: true,
  margin: { left: 36, right: 0, top: 0, bottom: 24 }
};

const TOOLTIP_MARGIN = 4;

const VerticalBarChart = (props: VerticalBarChartProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();
  const [hoveredDatum, setHoveredDatum] = useState<Datum | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const { data, margin, maxValue, minValue } = props;
  const {
    chartHeight,
    chartWidth,
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    svgHeight,
    svgWidth
  } = React.useMemo(
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

  const handleMouseEnter = React.useCallback(() => setIsHovering(true), []);
  const handleMouseOver = React.useCallback(setHoveredDatum, []);
  const handleMouseLeave = React.useCallback(() => setIsHovering(false), []);

  let marginX = 0;
  let marginY = 0;
  let hoverX = null;
  let hoverY = null;
  if (props.isInteractive && hoveredDatum) {
    // (hoverX, hoverY) === top + middle point of bar
    hoverX =
      (scaleX(hoveredDatum.x) || 0) +
      props.margin.left +
      scaleX.bandwidth() / 2;
    hoverY = (scaleY(hoveredDatum.y) || 0) + props.margin.top;
    marginX = TOOLTIP_MARGIN + scaleX.bandwidth() / 2;
    marginY = TOOLTIP_MARGIN;
  }

  return (
    <div className="vertical-bar-chart" ref={containerRef}>
      {chartHeight !== 0 && chartWidth !== 0 && (
        <div className="vertical-bar-chart__container">
          <svg height={svgHeight} width={svgWidth}>
            <g
              transform={`translate(${props.margin.left}, ${props.margin.top})`}
            >
              <Grid
                {...props.grid}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
              <Axis
                {...props.axis}
                height={chartHeight}
                width={chartWidth}
                scaleX={scaleX}
                scaleY={scaleY}
              />
              <Chart
                data={props.data}
                height={chartHeight}
                width={chartWidth}
                isInteractive={props.isInteractive}
                onMouseOver={handleMouseOver}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                scaleX={scaleX}
                scaleY={scaleY}
              />
            </g>
          </svg>
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

VerticalBarChart.defaultProps = defaultProps;

export default VerticalBarChart;
