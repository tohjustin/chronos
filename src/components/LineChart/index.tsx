import * as d3 from "d3";
import React from "react";

import { useClientDimensions } from "../../hooks";
import Axis from "./Axis";
import Chart from "./Chart";
import Tooltip from "./Tooltip";

import "./styles.scss";

interface LineChartProps {
  data: {
    x: number;
    y: number;
  }[];
}

const CHART_MARGIN = { top: 8, left: 40, bottom: 24, right: 24 };
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const LineChart = (props: LineChartProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();

  const [chartHeight, chartWidth] = [
    Math.max(containerHeight - CHART_MARGIN.top - CHART_MARGIN.bottom, 0),
    Math.max(containerWidth - CHART_MARGIN.left - CHART_MARGIN.right, 0)
  ];

  const startOfTheDayInMs = new Date().setHours(0, 0, 0, 0);
  const xMin = new Date(d3.min(props.data.map(d => d.x)) || startOfTheDayInMs);
  const xMax = new Date(d3.max(props.data.map(d => d.x)) || startOfTheDayInMs);
  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([0, chartWidth]);
  const dayRange = (xMax.valueOf() - xMin.valueOf()) / MS_PER_DAY;
  const xTickValues = [
    ...d3.timeDays(xMin, xMax, Math.ceil(dayRange / 5)),
    xMax
  ];

  const yDatasetMax = d3.max(props.data.map(d => d.y)) || MS_PER_HOUR;
  const yMax = yDatasetMax + MS_PER_HOUR;
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([chartHeight, 0]);
  const yStep = yMax > 8 * MS_PER_HOUR ? 2 * MS_PER_HOUR : MS_PER_HOUR;
  const yTickValues = d3.range(0, yMax, yStep);

  return (
    <div className="line-chart" ref={containerRef}>
      <svg height={containerHeight} width={containerWidth}>
        <g transform={`translate(${CHART_MARGIN.left}, ${CHART_MARGIN.top})`}>
          <Axis
            height={chartHeight}
            width={chartWidth}
            scaleX={xScale}
            scaleY={yScale}
            tickValuesX={xTickValues}
            tickValuesY={yTickValues}
          />
          <Chart data={props.data} scaleX={xScale} scaleY={yScale} />
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
  );
};

export default LineChart;
