import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

import "./styles.scss";

type GridSubConfiguration<T> = {
  enable: boolean;
  tickValues?: T[];
};

export type GridConfiguration<X, Y> = {
  horizontal: GridSubConfiguration<Y>;
  vertical: GridSubConfiguration<X>;
};

export interface GridProps<X, Y> extends GridConfiguration<X, Y> {
  height: number;
  width: number;
  scaleX: d3.AxisScale<X>;
  scaleY: d3.AxisScale<Y>;
}

function Grid<X extends d3.AxisDomain, Y extends d3.AxisDomain>({
  height,
  width,
  scaleX,
  scaleY,
  horizontal,
  vertical
}: GridProps<X, Y>) {
  const gridRef = useRef<SVGGElement | null>(null);
  useEffect(() => {
    const svg = d3.select(gridRef.current);

    // Remove existing SVG elements when re-rendering a new one
    svg.selectAll("g").remove();

    if (horizontal.enable) {
      const horizontalGrid = d3.axisRight<Y>(scaleY).tickSize(width);
      if (horizontal.tickValues && horizontal.tickValues.length > 0) {
        horizontalGrid.tickValues(horizontal.tickValues);
      }
      svg
        .append("g")
        .attr("class", "grid grid__horizontal-lines")
        .call(horizontalGrid)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text").remove());
    }

    if (vertical.enable) {
      const verticalAxis = d3.axisBottom<X>(scaleX).tickSize(height);
      if (vertical.tickValues && vertical.tickValues.length > 0) {
        verticalAxis.tickValues(vertical.tickValues);
      }
      svg
        .append("g")
        .attr("class", "grid grid__vertical-lines")
        .call(verticalAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text").remove());
    }
  }, [height, width, scaleX, scaleY, horizontal, vertical]);

  return <g ref={gridRef} className="grid__container" />;
}

export default Grid;
