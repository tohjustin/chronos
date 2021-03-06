import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import { BASE_SIZE } from "../../styles/constants";

import "./styles.scss";

type AxisSubConfiguration<T> = {
  enable: boolean;
  showDomain: boolean;
  formatTick?: (data: T, index: number) => string;
  tickValues?: T[];
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

function Axis<X extends d3.AxisDomain, Y extends d3.AxisDomain>({
  height,
  width,
  scaleX,
  scaleY,
  top,
  bottom,
  left,
  right
}: AxisProps<X, Y>) {
  const axisRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(axisRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    if (top.enable) {
      const topAxis = d3
        .axisTop<X>(scaleX)
        .tickPadding(BASE_SIZE)
        .tickSize(0);
      if (top.formatTick) {
        topAxis.tickFormat(top.formatTick);
      }
      if (top.tickValues && top.tickValues.length > 0) {
        topAxis.tickValues(top.tickValues);
      }
      const axis = svg
        .append("g")
        .attr("class", "axis axis__top")
        .call(topAxis);
      if (!top.showDomain) {
        axis.call(g => g.select(".domain").remove());
      }
    }

    if (bottom.enable) {
      const bottomAxis = d3
        .axisBottom<X>(scaleX)
        .tickPadding(BASE_SIZE)
        .tickSize(0);
      if (bottom.formatTick) {
        bottomAxis.tickFormat(bottom.formatTick);
      }
      if (bottom.tickValues && bottom.tickValues.length > 0) {
        bottomAxis.tickValues(bottom.tickValues);
      }
      const axis = svg
        .append("g")
        .attr("class", "axis axis__bottom")
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);
      if (!bottom.showDomain) {
        axis.call(g => g.select(".domain").remove());
      }
    }

    if (left.enable) {
      const leftAxis = d3
        .axisLeft<Y>(scaleY)
        .tickPadding(BASE_SIZE)
        .tickSize(0)
        .tickSizeOuter(0);
      if (left.formatTick) {
        leftAxis.tickFormat(left.formatTick);
      }
      if (left.tickValues && left.tickValues.length > 0) {
        leftAxis.tickValues(left.tickValues);
      }
      const axis = svg
        .append("g")
        .attr("class", "axis axis__left")
        .call(leftAxis);
      if (!left.showDomain) {
        axis.call(g => g.select(".domain").remove());
      }
    }

    if (right.enable) {
      const rightAxis = d3
        .axisRight<Y>(scaleY)
        .tickPadding(BASE_SIZE)
        .tickSize(0)
        .tickSizeOuter(0);
      if (right.formatTick) {
        rightAxis.tickFormat(right.formatTick);
      }
      if (right.tickValues && right.tickValues.length > 0) {
        rightAxis.tickValues(right.tickValues);
      }
      const axis = svg
        .append("g")
        .attr("class", "axis axis__right")
        .attr("transform", `translate(${width},0)`)
        .call(rightAxis);
      if (!right.showDomain) {
        axis.call(g => g.select(".domain").remove());
      }
    }
  }, [height, width, scaleX, scaleY, top, bottom, left, right]);

  return <g ref={axisRef} className="axis__container" />;
}

export default Axis;
