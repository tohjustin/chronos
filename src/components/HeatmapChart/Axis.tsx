import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { formatDayOfWeek, formatHourOfDay } from "./utils";

interface AxisProps {
  height: number;
  width: number;
  scaleX: d3.ScaleBand<number>;
  scaleY: d3.ScaleBand<number>;
}

const Axis = (props: AxisProps) => {
  const ref = useRef(null);
  const { height, width, scaleX, scaleY } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    // Draw x-axis
    const xAxis = d3
      .axisBottom(scaleX)
      .tickFormat(datum => {
        const tick = formatDayOfWeek(datum);
        return tick ? tick[0] : "";
      })
      .tickPadding(8)
      .tickSize(0);
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);

    // Draw y-axis
    const yAxis = d3
      .axisLeft<number>(scaleY)
      .tickFormat(formatHourOfDay)
      .tickPadding(8)
      .tickSize(0)
      .tickSizeOuter(0)
      .tickValues(d3.range(0, 24, 3));
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);
  }, [height, scaleX, scaleY, width]);

  return <g className="axis__container" ref={ref} />;
};

export default Axis;
