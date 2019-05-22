import * as d3 from "d3";
import React, { useRef, useState } from "react";

import { useClientDimensions } from "../../hooks";

import { formatDayOfWeek, formatDuration, formatHourOfDay } from "./utils";

interface TooltipProps {
  data: { x: number; y: number; z: number }[];
  chartHeight: number;
  chartWidth: number;
  containerHeight: number;
  containerWidth: number;
  offsetX: number;
  offsetY: number;
  scaleX: d3.ScaleBand<number>;
  scaleY: d3.ScaleBand<number>;
}

const Tooltip = (props: TooltipProps) => {
  const overlayRef = useRef<SVGRectElement>(null);
  const [tooltipRef, tooltipHeight, tooltipWidth] = useClientDimensions();
  const [hoveredDatumIndex, setHoveredDatumIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hoveredDatum = props.data[hoveredDatumIndex];
  if (hoveredDatum === undefined) {
    return null;
  }

  // Compute ruler & tooltip positions
  const x = props.scaleX(hoveredDatum.x) || 0;
  const y = props.scaleY(hoveredDatum.y) || 0;
  const cellWidth = props.scaleX.bandwidth();
  const cellHeight = props.scaleY.bandwidth();
  const tooltipX =
    x + tooltipWidth + cellWidth < props.chartWidth
      ? x + cellWidth
      : x - tooltipWidth;
  const tooltipY = y - (tooltipHeight - cellHeight) / 2;

  // Compute tooltip display values
  const [day, hour, time] = [hoveredDatum.x, hoveredDatum.y, hoveredDatum.z];

  return (
    <>
      <div
        ref={tooltipRef}
        className="tooltip__container"
        style={{
          left: `${tooltipX}px`,
          top: `${tooltipY}px`,
          opacity: isHovering ? 1 : 0,
          transform: `translate(${props.offsetX}px, ${props.offsetY}px)`
        }}
      >
        <div className="tooltip">
          <div className="tooltip__header">
            <strong>
              {`${formatDayOfWeek(day)}, ${formatHourOfDay(hour)}`}
            </strong>
          </div>
          <div className="tooltip__description">{formatDuration(time)}</div>
        </div>
      </div>
      <svg
        className="overlay__container"
        height={props.containerHeight}
        width={props.containerWidth}
      >
        <rect
          ref={overlayRef}
          className="overlay"
          height={props.chartHeight}
          width={props.chartWidth}
          transform={`translate(${props.offsetX}, ${props.offsetY})`}
          onMouseEnter={() => {
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
          onMouseMove={event => {
            if (overlayRef.current !== null) {
              const { left, top } = overlayRef.current.getBoundingClientRect();

              // Find datum closest to the cursor's position (requires dataset
              // to be evenly spaced)
              const cursorX = event.nativeEvent.clientX - left;
              const indexDay = Math.floor(cursorX / props.scaleX.step());
              const closestDay = props.scaleX.domain()[indexDay];
              const cursorY = event.nativeEvent.clientY - top;
              const indexHour = Math.floor(cursorY / props.scaleY.step());
              const closestHour = props.scaleY.domain()[indexHour];

              setHoveredDatumIndex(closestHour + closestDay * 24);
            }
          }}
        />
      </svg>
    </>
  );
};

export default Tooltip;
