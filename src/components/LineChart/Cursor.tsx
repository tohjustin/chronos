import React from "react";

interface CursorProps {
  isHovering: boolean;
  height: number;
  width: number;
  x: number | null;
  y: number | null;
}

// Match $dot__radius in "src/components/LineChart/styles.scss", we define it
// here again since FF doesn't allow SVGCircle attributes to be defined via
// stylesheets 🤦
const DOT_RADIUS =
  process.env.REACT_APP_BUILD_TARGET === "firefox" ? 3 : undefined;

const Cursor = ({ height, isHovering, x, y }: CursorProps) => {
  if (x === null || y === null) {
    return null;
  }

  return (
    <g className="line-chart__cursor-container" opacity={isHovering ? 1 : 0}>
      <line className="line-chart__ruler" x1={x} y1={0} x2={x} y2={height} />
      <circle className="line-chart__dot" cx={x} cy={y} r={DOT_RADIUS} />
      <circle
        className="line-chart__dot line-chart__dot--pulsing"
        cx={x}
        cy={y}
        r={DOT_RADIUS}
      />
    </g>
  );
};

export default Cursor;
