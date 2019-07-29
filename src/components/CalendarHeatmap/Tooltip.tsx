import React from "react";

import { formatTooltipDateLabel } from "../../utils/stringUtils";
import Tooltip from "../Tooltip";

import { Datum } from "./types";

const CalendarHeatmapTooltip = (props: { data: Datum }) => {
  const dateString = formatTooltipDateLabel(new Date(props.data.day));
  const value = props.data.value;

  return <Tooltip header={dateString} body={value} />;
};

export default CalendarHeatmapTooltip;
