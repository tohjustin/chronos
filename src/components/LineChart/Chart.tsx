import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface LineProps {
  data: { x: number; y: number }[];
  scaleX: d3.ScaleTime<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
}

const Line = (props: LineProps) => {
  const ref = useRef(null);
  const { data, scaleX, scaleY } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove();

    // Draw line
    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x(d => scaleX(d.x))
      .y(d => scaleY(d.y));
    svg
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", lineGenerator);

    // Draw single dot if there's only a single datapoint
    if (data.length === 1) {
      svg
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => scaleX(d.x))
        .attr("cy", d => scaleY(d.y));
    }
  }, [data, scaleX, scaleY]);

  return <g className="line__container" ref={ref} />;
};

export default Line;
