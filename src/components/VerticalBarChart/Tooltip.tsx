import React from "react";

import Tooltip from "../Tooltip";

import { Datum } from "./types";

const VerticalBarChartTooltip = (props: { data: Datum }) => {
  const { x, y } = props.data;

  return <Tooltip header={`${x}`} body={`${y}`} />;
};

export default VerticalBarChartTooltip;
