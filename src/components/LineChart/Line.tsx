import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface LineProps {
  data: { x: number; y: number }[];
  height: number;
  width: number;
  scaleX: d3.ScaleTime<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
}

const Line = (props: LineProps) => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("path").remove();
    svg.selectAll("circle").remove();

    // Draw line
    const lineGenerator = d3
      .line<{ x: number; y: number }>()
      .x(d => props.scaleX(d.x))
      .y(d => props.scaleY(d.y));
    svg
      .append("path")
      .datum(props.data)
      .attr("class", "line")
      .attr("d", lineGenerator);
  }, [props.data, props.height, props.width, props.scaleX, props.scaleY]);

  return <g className="line__container" ref={ref} />;
};

export default Line;
