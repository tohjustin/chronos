import React from "react";

import { useClientDimensions } from "../../hooks";

import "./styles.scss";

interface TooltipProps<T> {
  className: string;
  data: T | null;
}

interface TooltipRendererProps<T> {
  data: T | null;
  height: number;
  width: number;
  isHovering: boolean;
  marginX: number;
  marginY: number;
  offsetX: number;
  offsetY: number;
  x: number | null;
  y: number | null;

  component?: React.FC<TooltipProps<T>>;
}

function DefaultTooltip<T>(props: TooltipProps<T>) {
  return <div className={props.className}>{JSON.stringify(props.data)}</div>;
}

function TooltipRenderer<T>(props: TooltipRendererProps<T>) {
  const [tooltipRef, tooltipHeight, tooltipWidth] = useClientDimensions();

  // Compute tooltip positions
  let tooltipX = 0;
  let tooltipY = 0;
  if (props.x && props.y) {
    tooltipX =
      props.offsetX + props.x + tooltipWidth < props.width
        ? props.x
        : props.x - tooltipWidth;
    tooltipY =
      props.offsetY + props.y - tooltipHeight > 0
        ? props.y - tooltipHeight
        : props.y;
  }
  const Tooltip = props.component || DefaultTooltip;

  return (
    <div
      ref={tooltipRef}
      className="tooltip-renderer"
      style={{
        position: "absolute",
        left: `${tooltipX}px`,
        top: `${tooltipY}px`,
        padding: `${props.marginY}px ${props.marginX}px`,
        opacity: props.isHovering ? 1 : 0,
        pointerEvents: "none"
      }}
    >
      <Tooltip className="tooltip-renderer__component" data={props.data} />
    </div>
  );
}

export default TooltipRenderer;
