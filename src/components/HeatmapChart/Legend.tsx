import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface LegendProps {
  data: {
    x: number;
    y: number;
    z: number;
  }[];
  height: number;
  width: number;
  scaleY: d3.ScaleBand<number>;
  scaleZ: d3.ScaleQuantile<d3.ColorCommonInstance>;
}

const LEGEND_PADDING_TOP = 32;
const LEGEND_TICK_PADDING_LEFT = 2;

const Legend = (props: LegendProps) => {
  const ref = useRef(null);
  const { data, height, width, scaleY, scaleZ } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    const domainX = scaleZ.quantiles();
    const scaleX = d3
      .scaleBand<number>()
      .domain(domainX)
      .range([0, width])
      .paddingOuter(0)
      .paddingInner(0.05);
    const legendCellWidth = scaleX.bandwidth();
    const legendCellHeight = scaleY.bandwidth();
    const legendPositionY = height + LEGEND_PADDING_TOP;
    const legendTickPositionX =
      (-1 * legendCellWidth) / 2 + LEGEND_TICK_PADDING_LEFT;
    const legendTickPositionY = legendPositionY + legendCellHeight;

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g.heatmap__legend-cells").remove();
    svg.selectAll("g.heatmap__legend-ticks").remove();

    // Draw cells
    svg
      .append("g")
      .attr("class", "heatmap__legend-cells")
      .selectAll(".heatmap__legend-cell")
      .data(domainX)
      .enter()
      .append("rect")
      .attr("class", "heatmap__legend-cell")
      .attr("x", d => scaleX(d) || 0)
      .attr("width", () => legendCellWidth)
      .attr("y", () => legendPositionY)
      .attr("height", () => legendCellHeight)
      .style("fill", d => String(scaleZ(d) || "none"));

    // Draw labels
    const legendLabels = d3
      .axisBottom(scaleX)
      .tickFormat(datum => {
        const minutes = Number(datum) / 1000 / 60;
        return `${minutes}m`;
      })
      .tickPadding(8)
      .tickSize(0);
    svg
      .append("g")
      .attr("class", "heatmap__legend-ticks")
      .attr(
        "transform",
        `translate(${legendTickPositionX}, ${legendTickPositionY})`
      )
      .call(legendLabels)
      .selectAll("text")
      .attr("class", "heatmap__legend-tick")
      .style("text-anchor", "start");
  }, [data, height, width, scaleZ, scaleY]);

  return <g className="legend__container" ref={ref} />;
};

export default Legend;
