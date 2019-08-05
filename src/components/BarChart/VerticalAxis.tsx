import * as d3 from "d3";
import React from "react";

import { Datum } from "./types";

interface AxisProps {
  data: Datum[];
  offsetX: number;
  offsetY: number;
  scaleY: d3.ScaleBand<string>;
}

const VerticalAxis = (props: AxisProps) => (
  <div
    className="vertical-axis__container"
    style={{
      marginLeft: props.offsetX,
      transform: `translate(0px, ${props.offsetY}px)`
    }}
  >
    {
      // Parent divs cannot inherit the width of child elements that has the
      // `position: absolute` property, we render a copy of childrem that is
      // hidden & not positioned absolutely (`.labels-dummy') to ensure that
      // the parent div (`.vertical-axis__container`) inherits the appropriate
      // width.
    }
    <div className="labels labels--dummy">
      {props.data.map(datum => (
        <div className="label" key={datum.y}>
          {datum.y}
        </div>
      ))}
    </div>
    <div className="labels">
      {props.data.map(datum => (
        <div
          className="label"
          key={datum.y}
          style={{
            position: "absolute",
            top: props.scaleY(datum.y),
            lineHeight: `${props.scaleY.bandwidth()}px`
          }}
        >
          {datum.y}
        </div>
      ))}
    </div>
  </div>
);

export default VerticalAxis;
