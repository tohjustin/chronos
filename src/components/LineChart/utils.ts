import * as d3 from "d3";

import { MarginConfiguration } from "../types";

import { Datum } from "./types";

const PADDING_Y = 0.1;

export function computeSizes({
  containerHeight: height,
  containerWidth: width,
  data,
  margin,
  maxValue,
  minValue
}: {
  containerHeight: number;
  containerWidth: number;
  data: Datum[];
  margin: MarginConfiguration;
  maxValue?: number;
  minValue?: number;
}) {
  // compute chart dimensions
  const chartWidth = Math.max(width - margin.left - margin.right, 0);
  const chartHeight = Math.max(height - margin.top - margin.bottom, 0);

  // compute scales
  const xMin = d3.min(data.map(d => d.x)) || 0;
  const xMax = d3.max(data.map(d => d.x)) || 0;
  const scaleX: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, chartWidth]);
  const domainY = [
    minValue !== undefined ? minValue : 0,
    maxValue !== undefined ? maxValue : d3.max(data.map(d => d.y)) || 0
  ].map(d => Math.floor(d * (1 + PADDING_Y))) as [number, number];
  const scaleY: d3.ScaleLinear<number, number> = d3
    .scaleLinear()
    .domain(domainY)
    .range([chartHeight, 0]);

  return {
    chartHeight,
    chartWidth,
    scaleX,
    scaleY,
    svgHeight: height,
    svgWidth: width
  };
}
