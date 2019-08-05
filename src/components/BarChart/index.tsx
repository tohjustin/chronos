import * as d3 from "d3";
import React from "react";

import { useClientDimensions } from "../../hooks";
import Axis from "./Axis";
import Chart from "./Chart";
import Tooltip from "./Tooltip";
import VerticalAxis from "./VerticalAxis";
import { Datum } from "./types";

import "./styles.scss";

interface BarChartProps {
  data: Datum[];
}

const CHART_MARGIN = { top: 0, left: 8, bottom: 24, right: 24 };
const MS_PER_HOUR = 3600000;

const BarChart = (props: BarChartProps) => {
  const [containerRef, containerHeight, containerWidth] = useClientDimensions();

  const [chartHeight, chartWidth] = [
    Math.max(containerHeight - CHART_MARGIN.top - CHART_MARGIN.bottom, 0),
    Math.max(containerWidth - CHART_MARGIN.left - CHART_MARGIN.right, 0)
  ];

  const xDatasetMax = d3.max(props.data.map(d => d.x)) || MS_PER_HOUR;
  const xMax = xDatasetMax + MS_PER_HOUR;
  const xScale = d3
    .scaleLinear()
    .domain([0, xMax])
    .range([0, chartWidth]);
  const xStep = Math.ceil(xMax / 5 / MS_PER_HOUR) * MS_PER_HOUR;
  const xTickValues = d3.range(0, xMax, xStep);

  const yScale = d3
    .scaleBand()
    .domain(props.data.map(datum => datum.y))
    .range([0, chartHeight])
    .padding(0.25);

  return (
    <div className="bar-chart">
      {
        // SVG doesn't handle truncating text as well as HTML so we created a
        // separate component for rendering the y-axis labels
      }
      <VerticalAxis
        data={props.data}
        scaleY={yScale}
        offsetX={CHART_MARGIN.left}
        offsetY={CHART_MARGIN.top}
      />
      <div className="chart__container" ref={containerRef}>
        <svg height={containerHeight} width={containerWidth}>
          <g transform={`translate(0, ${CHART_MARGIN.top})`}>
            <Axis
              height={chartHeight}
              width={chartWidth}
              scaleX={xScale}
              scaleY={yScale}
              tickValuesX={xTickValues}
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
          offsetX={0}
          offsetY={CHART_MARGIN.top}
        />
      </div>
    </div>
  );
};

export default BarChart;
