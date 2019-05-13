import * as d3 from "d3";
import React from "react";

import { useClientDimensions } from "../../hooks";
import Axis from "./Axis";
import Line from "./Line";
import Tooltip from "./Tooltip";

import "./styles.scss";

interface LineChartProps {
  data: {
    x: number;
    y: number;
  }[];
}

const CHART_MARGIN = { top: 8, left: 60, bottom: 24, right: 24 };
const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const Y_STEP = 2 * MS_PER_HOUR;

const LineChart = (props: LineChartProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();

  const [chartHeight, chartWidth] = [
    Math.max(containerHeight - CHART_MARGIN.top - CHART_MARGIN.bottom, 0),
    Math.max(containerWidth - CHART_MARGIN.left - CHART_MARGIN.right, 0)
  ];

  const xMin = new Date(d3.min(props.data.map(d => d.x)) || Date.now());
  const xMax = new Date(d3.max(props.data.map(d => d.x)) || Date.now());
  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([0, chartWidth]);
  const dayRange = Math.floor((xMax.valueOf() - xMin.valueOf()) / MS_PER_DAY);
  const xTickValues = d3.timeDays(xMin, xMax, Math.floor(dayRange / 5));

  const yDatasetMax = d3.max(props.data.map(d => d.y)) || 24 * MS_PER_HOUR;
  const yMax = yDatasetMax + MS_PER_HOUR;
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([chartHeight, 0]);
  const yTickValues = d3.range(0, yMax, Y_STEP);

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
          <Line data={props.data} scaleX={xScale} scaleY={yScale} />
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
