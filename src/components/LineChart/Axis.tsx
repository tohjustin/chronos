import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

interface AxisProps {
  height: number;
  width: number;
  scaleX: d3.ScaleTime<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
  tickValuesX: Date[];
  tickValuesY: number[];
}

const Axis = (props: AxisProps) => {
  const ref = useRef(null);
  const { height, width, scaleX, scaleY, tickValuesX, tickValuesY } = props;

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    // Draw x-axis
    const xAxis = d3
      .axisBottom<Date>(scaleX)
      .tickPadding(8)
      .tickSize(-4)
      .tickSizeOuter(0)
      .tickValues(tickValuesX);
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Draw y-axis
    const yAxis = d3
      .axisLeft<number>(scaleY)
      .tickFormat(datum => {
        const hours = datum / 1000 / 60 / 60;
        return `${hours}h`;
      })
      .tickPadding(8)
      .tickSize(0)
      .tickValues(tickValuesY);
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    // Draw vertical grid lines
    const verticalGridLines = d3
      .axisBottom(scaleX)
      .tickSize(-1 * height)
      .tickSizeOuter(0)
      .tickValues(tickValuesX);
    svg
      .append("g")
      .attr("class", "y grid")
      .attr("transform", "translate(0," + height + ")")
      .call(verticalGridLines)
      .selectAll(".tick text")
      .remove();

    // Draw horizontal grid lines
    const horizontalGridLines = d3
      .axisLeft(scaleY)
      .tickSize(-1 * width)
      .tickSizeOuter(0)
      .tickValues(tickValuesY);
    svg
      .append("g")
      .attr("class", "x grid")
      .call(horizontalGridLines)
      .selectAll(".tick text")
      .remove();
  }, [height, scaleX, scaleY, tickValuesX, tickValuesY, width]);

  return <g className="axis__container" ref={ref} />;
};

export default Axis;
