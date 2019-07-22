import * as d3 from "d3";

import { MarginConfiguration } from "../types";

import { CellConfiguration, Datum } from "./types";

export function computeSizes({
  cell,
  containerHeight: height,
  containerWidth: width,
  data,
  margin
}: {
  cell: CellConfiguration;
  containerHeight: number;
  containerWidth: number;
  data: Datum[];
  margin: MarginConfiguration;
}) {
  // compute chart dimensions
  const xCellCount = (d3.max(data.map(d => d.x)) || 0) + 1;
  const yCellCount = (d3.max(data.map(d => d.y)) || 0) + 1;
  const availableWidth = Math.max(width - margin.left - margin.right, 0);
  const availableHeight = Math.max(height - margin.top - margin.bottom, 0);
  let chartWidth = availableWidth;
  let chartHeight = availableHeight;
  if (cell.forceSquare) {
    if (availableWidth / xCellCount < availableHeight / yCellCount) {
      chartWidth = availableWidth;
      chartHeight = (yCellCount / xCellCount) * availableWidth;
    } else {
      chartWidth = (xCellCount / yCellCount) * availableHeight;
      chartHeight = availableHeight;
    }
  }
  const svgWidth = chartWidth + margin.left + margin.right;
  const svgHeight = chartHeight + margin.bottom + margin.top;
  const offsetX = (width - svgWidth) / 2;
  const offsetY = (height - svgHeight) / 2;

  // compute cell dimensions
  const xPixelPerCell = chartWidth / xCellCount || 1;
  const yPixelPerCell = chartHeight / yCellCount || 1;
  const cellSize = Math.min(xPixelPerCell, yPixelPerCell);
  const xPaddingInner = (cellSize / xPixelPerCell) * cell.marginRatio;
  const yPaddingInner = (cellSize / yPixelPerCell) * cell.marginRatio;

  // compute scales
  const scaleX: d3.ScaleBand<number> = d3
    .scaleBand<number>()
    .domain(d3.range(0, xCellCount))
    .range([0, chartWidth])
    .paddingOuter(0)
    .paddingInner(xPaddingInner);
  const scaleY: d3.ScaleBand<number> = d3
    .scaleBand<number>()
    .domain(d3.range(0, yCellCount))
    .range([0, chartHeight])
    .paddingOuter(0)
    .paddingInner(yPaddingInner);
  const cellWidth = scaleX.bandwidth();
  const cellHeight = scaleY.bandwidth();
  const cellSpacingX = scaleX.step() - cellWidth;
  const cellSpacingY = scaleY.step() - cellHeight;

  return {
    cellHeight,
    cellSpacingX,
    cellSpacingY,
    cellWidth,
    chartHeight,
    chartWidth,
    offsetX,
    offsetY,
    scaleX,
    scaleY,
    svgHeight,
    svgWidth
  };
}

export function computeColors(
  colorRange: [string, string],
  thresholds: number[]
) {
  const [colorMin, colorMax] = colorRange;
  const [zMin, zMax] = thresholds;
  const zInterval = 1 / Math.max(1, thresholds.length - 2);
  const colorGenerator = d3
    .scaleLinear<d3.ColorCommonInstance>()
    .domain([zMin, zMax])
    .range([d3.rgb(colorMin), d3.rgb(colorMax)]);
  const colors = d3
    .range(0, 1 + zInterval, zInterval)
    .map(d => colorGenerator(d * zMax));
  const scaleZ = d3
    .scaleQuantile<d3.ColorCommonInstance>()
    .domain(thresholds)
    .range(colors);

  return { colors, scaleZ };
}
