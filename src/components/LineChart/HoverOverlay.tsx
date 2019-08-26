import React from "react";

import { useClientDimensions } from "../../hooks";

import { Datum } from "./types";

interface HoverOverlayProps {
  onMouseOver: (datum: Datum | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;

  data: Datum[];
  height: number;
  width: number;
  marginX: number;
  marginY: number;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
}

const HoverOverlay = ({
  data,
  height,
  width,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
  marginX,
  marginY,
  scaleX
}: HoverOverlayProps) => {
  const [containerRef, { left: containerRectLeft }] = useClientDimensions();
  const [domainXMin, domainXMax] = scaleX.domain() as [number, number];
  const domainStep = (domainXMax - domainXMin) / Math.max(data.length - 1, 1);
  const handleMouseOver = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (data.length === 0) {
      onMouseOver(null);
    }
    if (data.length === 1) {
      onMouseOver(data[0]);
    }

    // Find closest datum to hovered position
    const hoverX = event.clientX - containerRectLeft;
    const domainX = scaleX.invert(hoverX);
    const hoverDatum = data.find(d => Math.abs(d.x - domainX) < domainStep / 2);
    if (hoverDatum) {
      onMouseOver(hoverDatum);
    }
  };

  return (
    <div
      className="line-chart__hover-overlay"
      ref={containerRef}
      style={{
        position: "absolute",
        left: `${marginX}px`,
        top: `${marginY}px`,
        height: `${height}px`,
        width: `${width}px`
      }}
      onMouseMove={handleMouseOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    ></div>
  );
};

export default HoverOverlay;
