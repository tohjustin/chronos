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

  useEffect(() => {
    const svg = d3.select(ref.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    // Draw x-axis
    const xAxis = d3
      .axisBottom(props.scaleX)
      .tickPadding(8)
      .tickSize(-4)
      .tickSizeOuter(0)
      .tickValues(props.tickValuesX);
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + props.height + ")")
      .call(xAxis);

    // Draw y-axis
    const yAxis = d3
      .axisLeft(props.scaleY)
      .tickFormat(datum => `${Number(datum) / 1000 / 60 / 60} hours`)
      .tickPadding(8)
      .tickSize(0)
      .tickValues(props.tickValuesY);
    svg
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);

    // Draw vertical grid lines
    const verticalGridLines = d3
      .axisBottom(props.scaleX)
      .tickSize(-1 * props.height)
      .tickSizeOuter(0)
      .tickValues(props.tickValuesX);
    svg
      .append("g")
      .attr("class", "y grid")
      .attr("transform", "translate(0," + props.height + ")")
      .call(verticalGridLines)
      .selectAll(".tick text")
      .remove();

    // Draw horizontal grid lines
    const horizontalGridLines = d3
      .axisLeft(props.scaleY)
      .tickSize(-1 * props.width)
      .tickSizeOuter(0)
      .tickValues(props.tickValuesY);
    svg
      .append("g")
      .attr("class", "x grid")
      .call(horizontalGridLines)
      .selectAll(".tick text")
      .remove();
  }, [props.height, props.width, props.scaleX, props.scaleY]);

  return <g className="axis__container" ref={ref} />;
};

export default Axis;
