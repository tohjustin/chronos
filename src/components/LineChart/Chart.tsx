import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { Datum } from "./types";

interface ChartProps {
  onMouseOver: (datum: Datum) => void;
  onMouseEnter: (datum: Datum) => void;
  onMouseLeave: (datum: Datum) => void;

  data: Datum[];
  height: number;
  width: number;
  isInteractive: boolean;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
  transitionDelay: number;
}

const Chart = ({
  data,
  height,
  width,
  isInteractive,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
  scaleX,
  scaleY,
  transitionDelay
}: ChartProps) => {
  const chartRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove();
    svg.selectAll("rect").remove();

    if (isInteractive) {
      const regionWidth = width / data.length;

      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .on("mouseover", d => onMouseOver(d))
        .on("mouseenter", d => onMouseEnter(d))
        .on("mouseleave", d => onMouseLeave(d))
        .attr("class", "line-chart__hover-region")
        .attr("x", d => scaleX(d.x) - regionWidth / 2)
        .attr("width", () => regionWidth)
        .attr("y", () => 0)
        .attr("height", () => height);
    }

    // Draw line
    const lineGenerator = d3
      .line<Datum>()
      .x(d => scaleX(d.x))
      .y(d => scaleY(d.y));
    svg
      .append("path")
      .datum(data)
      .attr("class", "line-chart__line")
      .attr("d", lineGenerator);

    // Draw single dot if there's only a single datapoint
    if (data.length === 1) {
      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "line-chart__dot")
        .attr("cx", d => scaleX(d.x))
        .attr("cy", d => scaleY(d.y));
    }
  }, [
    data,
    height,
    isInteractive,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    scaleX,
    scaleY,
    width
  ]);

  return <g ref={chartRef} className="line-chart__chart" />;
};

export default Chart;
