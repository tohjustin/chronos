import React from "react";

interface CursorProps {
  isHovering: boolean;
  height: number;
  width: number;
  x: number | null;
  y: number | null;
}

const Cursor = ({ height, isHovering, x, y }: CursorProps) => {
  if (x === null || y === null) {
    return null;
  }

  return (
    <g className="line-chart__cursor-container" opacity={isHovering ? 1 : 0}>
      <line className="line-chart__ruler" x1={x} y1={0} x2={x} y2={height} />
      <circle className="line-chart__dot" cx={x} cy={y} />
      <circle
        className="line-chart__dot line-chart__dot--pulsing"
        cx={x}
        cy={y}
      />
    </g>
  );
};

export default Cursor;
