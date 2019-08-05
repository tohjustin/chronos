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
  scaleX: d3.ScaleBand<number>;
  scaleY: d3.ScaleLinear<number, number>;
}

const Chart = (props: ChartProps) => {
  const {
    data,
    height,
    width,
    isInteractive,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    scaleX,
    scaleY
  } = props;
  const chartRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("rect").remove();

    // Draw bars
    const bars = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "vertical-bar-chart__bar-container");

    if (isInteractive) {
      const widthReservedForPadding = width * scaleX.paddingInner();
      const barPadding = widthReservedForPadding / scaleX.domain().length / 2;
      const barContainerWidth = scaleX.bandwidth() + barPadding * 2;

      bars
        .on("mouseover", d => onMouseOver(d))
        .on("mouseenter", d => onMouseEnter(d))
        .on("mouseleave", d => onMouseLeave(d))
        .append("rect")
        .attr("class", "vertical-bar-chart__bar--background")
        .attr("x", d => (scaleX(d.x) || 0) - barPadding)
        .attr("width", () => barContainerWidth)
        .attr("y", () => 0)
        .attr("height", () => height);
    }

    bars
      .append("rect")
      .attr("class", "vertical-bar-chart__bar")
      .attr("x", d => scaleX(d.x) || 0)
      .attr("width", () => scaleX.bandwidth())
      .attr("y", d => scaleY(d.y) || 0)
      .attr("height", d => height - (scaleY(d.y) || 0));
  }, [
    data,
    height,
    width,
    isInteractive,
    onMouseEnter,
    onMouseLeave,
    onMouseOver,
    scaleX,
    scaleY
  ]);

  return <g ref={chartRef} className="vertical-bar-chart__chart" />;
};

export default Chart;
