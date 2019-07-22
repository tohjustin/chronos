import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import "./styles.scss";

type AxisSubConfiguration<T> = {
  enable: boolean;
  formatTick: (data: T) => string;
};

export type AxisConfiguration<X, Y> = {
  bottom: AxisSubConfiguration<X>;
  left: AxisSubConfiguration<Y>;
  right: AxisSubConfiguration<Y>;
  top: AxisSubConfiguration<X>;
};

export interface AxisProps<X, Y> extends AxisConfiguration<X, Y> {
  height: number;
  width: number;
  scaleX: d3.AxisScale<X>;
  scaleY: d3.AxisScale<Y>;
}

function Axis<X extends d3.AxisDomain, Y extends d3.AxisDomain>(
  props: AxisProps<X, Y>
) {
  const axisRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(axisRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    if (props.top.enable) {
      const topAxis = d3
        .axisTop<X>(props.scaleX)
        .tickFormat(props.top.formatTick)
        .tickPadding(8)
        .tickSize(0);
      svg
        .append("g")
        .attr("class", "axis axis__top")
        .call(topAxis);
    }

    if (props.bottom.enable) {
      const bottomAxis = d3
        .axisBottom<X>(props.scaleX)
        .tickFormat(props.bottom.formatTick)
        .tickPadding(8)
        .tickSize(0);
      svg
        .append("g")
        .attr("class", "axis axis__bottom")
        .attr("transform", `translate(0,${props.height})`)
        .call(bottomAxis);
    }

    if (props.left.enable) {
      const leftAxis = d3
        .axisLeft<Y>(props.scaleY)
        .tickFormat(props.left.formatTick)
        .tickPadding(8)
        .tickSize(0)
        .tickSizeOuter(0);
      svg
        .append("g")
        .attr("class", "axis axis__left")
        .call(leftAxis);
    }

    if (props.right.enable) {
      const rightAxis = d3
        .axisRight<Y>(props.scaleY)
        .tickFormat(props.right.formatTick)
        .tickPadding(8)
        .tickSize(0)
        .tickSizeOuter(0);
      svg
        .append("g")
        .attr("class", "axis axis__right")
        .attr("transform", `translate(${props.width},0)`)
        .call(rightAxis);
    }
  }, [props.height, props.width, props, props.scaleX, props.scaleY]);

  return <g ref={axisRef} className="axis__container" />;
}

export default Axis;
