import * as d3 from "d3";
import React, { useRef, useState } from "react";

import { useClientDimensions } from "../../hooks";
import { formatTooltipDurationLabel } from "../../utils/stringUtils";

interface TooltipProps {
  data: { x: number; y: number }[];
  chartHeight: number;
  chartWidth: number;
  containerHeight: number;
  containerWidth: number;
  offsetX: number;
  offsetY: number;
  scaleX: d3.ScaleTime<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
}

const Tooltip = (props: TooltipProps) => {
  const overlayRef = useRef<SVGRectElement>(null);
  const [tooltipRef, tooltipHeight, tooltipWidth] = useClientDimensions();
  const [hoveredDatumIndex, setHoveredDatumIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const hoveredDatum = props.data[hoveredDatumIndex] || { x: 0, y: 0 };

  // Compute ruler & tooltip positions
  const x = props.scaleX(hoveredDatum.x);
  const y = props.scaleY(hoveredDatum.y);
  const tooltipX = x + tooltipWidth < props.chartWidth ? x : x - tooltipWidth;
  const tooltipY = y < tooltipHeight ? y : y - tooltipHeight;

  // Compute tooltip display values
  const date = new Date(hoveredDatum.x).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric"
  });
  const duration = hoveredDatum.y;

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
          <strong className="tooltip__header">{date}</strong>
          <div className="tooltip__description">
            {formatTooltipDurationLabel(duration)}
          </div>
        </div>
      </div>
      <svg
        className="ruler__container"
        height={props.containerHeight}
        width={props.containerWidth}
        opacity={isHovering ? 1 : 0}
      >
        <g transform={`translate(${props.offsetX}, ${props.offsetY})`}>
          <line className="ruler" x1={x} y1={0} x2={x} y2={props.chartHeight} />
          <circle className="dot" cx={x} cy={y} />
          <circle className="dot dot--pulsing" cx={x} cy={y} />
        </g>
      </svg>
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
              const { left } = overlayRef.current.getBoundingClientRect();

              // Find datum closest to the cursor's position (requires dataset
              // to be evenly spaced)
              const cursorX = event.nativeEvent.clientX - left;
              const closestDatumIndex = Math.round(
                (cursorX / props.chartWidth) * (props.data.length - 1)
              );

              setIsHovering(Boolean(props.data[closestDatumIndex]));
              setHoveredDatumIndex(closestDatumIndex);
            } else {
              setIsHovering(false);
            }
          }}
        />
      </svg>
    </>
  );
};

export default Tooltip;
