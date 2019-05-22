import * as d3 from "d3";
import React from "react";

import { useClientDimensions } from "../../hooks";

import Axis from "./Axis";
import Chart from "./Chart";
import Legend from "./Legend";
import Tooltip from "./Tooltip";

import "./styles.scss";

interface HeatmapChartProps {
  data: {
    x: number;
    y: number;
    z: number;
  }[];
}

const CHART_MARGIN = { top: 4, left: 42, bottom: 56, right: 0 };
const MS_PER_MIN = 60000;

const HeatmapChart = (props: HeatmapChartProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();

  const [chartHeight, chartWidth] = [
    Math.max(containerHeight - CHART_MARGIN.top - CHART_MARGIN.bottom, 0),
    Math.max(containerWidth - CHART_MARGIN.left - CHART_MARGIN.right, 0)
  ];
  const paddingInner = Math.max(4, containerWidth / 100);

  const [xMin = 0, xMax = 0] = d3.extent(props.data.map(datum => datum.x));
  const xRange = d3.range(xMin, xMax + 1);
  const xPaddingInner = (paddingInner * (xRange.length - 1)) / containerWidth;
  const xScale = d3
    .scaleBand<number>()
    .domain(xRange)
    .range([0, chartWidth])
    .paddingOuter(0)
    .paddingInner(xPaddingInner);

  const [yMin = 0, yMax = 0] = d3.extent(props.data.map(datum => datum.y));
  const yRange = d3.range(yMin, yMax + 1);
  const yPaddingInner = (paddingInner * (yRange.length - 1)) / containerHeight;
  const yScale = d3
    .scaleBand<number>()
    .domain(yRange)
    .range([0, chartHeight])
    .paddingOuter(0)
    .paddingInner(yPaddingInner);

  const zMax = 60 * MS_PER_MIN;
  const zDomain = [0, 1, 15, 30, 45, 60].map(d => d * MS_PER_MIN);
  const zSteps = zDomain.length - 2 > 0 ? 1 / (zDomain.length - 2) : 1;
  const colorGenerator = d3
    .scaleLinear<d3.ColorCommonInstance>()
    .domain([0, zMax])
    .range([d3.rgb("#f6f6f6"), d3.rgb("#3D9CF4")]);
  const colorRange = d3
    .range(0, 1 + zSteps, zSteps)
    .map(d => colorGenerator(zMax * d));
  const zScale = d3
    .scaleQuantile<d3.ColorCommonInstance>()
    .domain(zDomain)
    .range(colorRange);

  return (
    <div className="heatmap-chart">
      <div className="chart__container" ref={containerRef}>
        <svg height={containerHeight} width={containerWidth}>
          <g transform={`translate(${CHART_MARGIN.left}, ${CHART_MARGIN.top})`}>
            <Axis
              height={chartHeight}
              width={chartWidth}
              scaleX={xScale}
              scaleY={yScale}
            />
            <Chart
              data={props.data}
              scaleX={xScale}
              scaleY={yScale}
              scaleZ={zScale}
            />
            <Legend
              data={props.data}
              height={chartHeight}
              width={chartWidth}
              scaleY={yScale}
              scaleZ={zScale}
            />
          </g>
        </svg>
        <Tooltip
          data={props.data}
          containerHeight={containerHeight}
          containerWidth={containerWidth}
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          scaleX={xScale}
          scaleY={yScale}
          offsetX={CHART_MARGIN.left}
          offsetY={CHART_MARGIN.top}
        />
      </div>
    </div>
  );
};

export default HeatmapChart;
