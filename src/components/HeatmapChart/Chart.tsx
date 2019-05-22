import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface ChartProps {
  data: { x: number; y: number; z: number }[];
  scaleX: d3.ScaleBand<number>;
  scaleY: d3.ScaleBand<number>;
  scaleZ: d3.ScaleQuantile<d3.ColorCommonInstance>;
}

const Chart = (props: ChartProps) => {
  const ref = useRef(null);
  const { data, scaleX, scaleY, scaleZ } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("rect").remove();

    // Draw cells
    svg
      .selectAll(".heatmap__cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "heatmap__cell")
      .attr("x", d => scaleX(d.x) || 0)
      .attr("width", () => scaleX.bandwidth())
      .attr("y", d => scaleY(d.y) || 0)
      .attr("height", () => scaleY.bandwidth())
      .style("fill", d => String(scaleZ(d.z) || "none"));
  }, [data, scaleX, scaleY, scaleZ]);

  return <g className="heatmap__container" ref={ref} />;
};

export default Chart;
