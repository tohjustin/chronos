import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { Datum } from "./types";

interface ChartProps {
  data: Datum[];
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleBand<string>;
}

const Chart = (props: ChartProps) => {
  const ref = useRef(null);
  const { data, scaleX, scaleY } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("rect").remove();

    // Draw bars
    svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", () => 0)
      .attr("width", d => scaleX(d.x))
      .attr("y", d => scaleY(d.y) || 0)
      .attr("height", () => scaleY.bandwidth());
  }, [data, scaleX, scaleY]);

  return <g className="bar__container" ref={ref} />;
};

export default Chart;
