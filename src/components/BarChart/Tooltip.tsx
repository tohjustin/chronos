import * as d3 from "d3";
import React, { useRef, useState } from "react";

import { useClientDimensions } from "../../hooks";

interface TooltipProps {
  data: { x: number; y: string; favIconUrl: string }[];
  chartHeight: number;
  chartWidth: number;
  containerHeight: number;
  containerWidth: number;
  offsetX: number;
  offsetY: number;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleBand<string>;
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
  const x = props.scaleX(hoveredDatum.x);
  const y = props.scaleY(hoveredDatum.y) || 0;
  const barThickness = props.scaleY.bandwidth();
  const tooltipX = x + tooltipWidth < props.chartWidth ? x : x - tooltipWidth;
  const tooltipY = y - (tooltipHeight - barThickness) / 2;

  // Compute tooltip display values
  const domain = hoveredDatum.y;
  const durationInMins = hoveredDatum.x / 60000;
  const hours = Math.floor(durationInMins / 60);
  const minutes = Math.floor(durationInMins) % 60;

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
            {hoveredDatum.favIconUrl && (
              <img
                className="tooltip__favicon"
                alt="domain-favicon"
                src={hoveredDatum.favIconUrl}
              />
            )}
            <strong>{domain}</strong>
          </div>
          <div className="tooltip__description">
            {hours > 0 && `${hours} ${hours > 1 ? "hours" : "hour"} `}
            {minutes > 0 && `${minutes} ${minutes > 1 ? "minutes" : "minute"}`}
            {durationInMins !== 0 &&
              hours === 0 &&
              minutes === 0 &&
              "Less than 1 minute"}
            {durationInMins === 0 && "No activity"}
          </div>
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
              const { top } = overlayRef.current.getBoundingClientRect();

              // Find datum closest to the cursor's position (requires dataset
              // to be evenly spaced)
              const cursorY = event.nativeEvent.clientY - top;
              const barWidth = props.scaleY.bandwidth();
              let closestDatumIndex = props.data.length - 1;
              for (let i = 0; i < props.data.length; i++) {
                if (cursorY < (props.scaleY(props.data[i].y) || 0) + barWidth) {
                  closestDatumIndex = i;
                  break;
                }
              }

              setHoveredDatumIndex(closestDatumIndex);
            }
          }}
        />
      </svg>
    </>
  );
};

export default Tooltip;
