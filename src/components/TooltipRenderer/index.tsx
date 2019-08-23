import React from "react";

import { useClientDimensions } from "../../hooks";
import Tooltip from "../Tooltip";

import "./styles.scss";

interface TooltipProps<T> {
  className: string;
  data: T | null;
}

interface TooltipRendererProps<T> {
  data: T | null;
  height: number;
  width: number;
  x: number | null;
  y: number | null;

  isHovering?: boolean;
  marginX?: number;
  marginY?: number;
  offsetX?: number;
  offsetY?: number;
  component?: React.FC<TooltipProps<T>>;
}

function DefaultTooltip<T>(props: TooltipProps<T>) {
  return (
    <Tooltip className={props.className} body={JSON.stringify(props.data)} />
  );
}

export const defaultProps = {
  isHovering: false,
  marginX: 0,
  marginY: 0,
  offsetX: 0,
  offsetY: 0,
  component: DefaultTooltip
};

function TooltipRenderer<T>({
  data,
  width,
  x,
  y,
  isHovering = defaultProps.isHovering,
  marginX = defaultProps.marginX,
  marginY = defaultProps.marginY,
  offsetX = defaultProps.offsetX,
  offsetY = defaultProps.offsetY,
  component: TooltipComponent = defaultProps.component
}: TooltipRendererProps<T>) {
  const [tooltipRef, tooltipHeight, tooltipWidth] = useClientDimensions();

  // Compute tooltip positions
  let tooltipX = 0;
  let tooltipY = 0;
  if (x && y) {
    tooltipX = offsetX + x + tooltipWidth < width ? x : x - tooltipWidth;
    tooltipY = offsetY + y - tooltipHeight > 0 ? y - tooltipHeight : y;
  }

  return (
    <div
      ref={tooltipRef}
      className="tooltip-renderer"
      style={{
        position: "absolute",
        left: `${tooltipX}px`,
        top: `${tooltipY}px`,
        padding: `${marginY}px ${marginX}px`,
        opacity: isHovering ? 1 : 0,
        pointerEvents: "none"
      }}
    >
      <TooltipComponent className="tooltip-renderer__component" data={data} />
    </div>
  );
}

export default TooltipRenderer;
