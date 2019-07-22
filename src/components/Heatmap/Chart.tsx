import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { CellConfiguration, Datum } from "./types";

interface ChartProps {
  onMouseOver: (datum: Datum) => void;
  onMouseEnter: (datum: Datum) => void;
  onMouseLeave: (datum: Datum) => void;

  cell: CellConfiguration;
  data: Datum[];
  isInteractive: boolean;
  scaleX: d3.ScaleBand<number>;
  scaleY: d3.ScaleBand<number>;
  scaleZ: d3.ScaleQuantile<d3.ColorCommonInstance>;
}

const Chart = (props: ChartProps) => {
  const {
    cell,
    data,
    isInteractive,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    scaleX,
    scaleY,
    scaleZ
  } = props;
  const chartRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(chartRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("rect").remove();

    // Draw cells
    const chart = svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "heatmap__chart-cell")
      .attr("rx", () => cell.radius)
      .attr("x", d => scaleX(d.x) || 0)
      .attr("width", () => scaleX.bandwidth())
      .attr("y", d => scaleY(d.y) || 0)
      .attr("height", () => scaleY.bandwidth())
      .style("fill", d => String(scaleZ(d.z === null ? NaN : d.z) || "none"));

    if (isInteractive) {
      chart
        .on("mouseover", d => onMouseOver(d))
        .on("mouseenter", d => onMouseEnter(d))
        .on("mouseleave", d => onMouseLeave(d));
    }
  }, [
    cell,
    data,
    isInteractive,
    onMouseOver,
    onMouseEnter,
    onMouseLeave,
    scaleX,
    scaleY,
    scaleZ
  ]);

  return <g ref={chartRef} className="heatmap__chart" />;
};

export default Chart;
