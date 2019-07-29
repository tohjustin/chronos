import React from "react";

import { formatTooltipDateLabel } from "../../utils/stringUtils";
import Tooltip from "../Tooltip";

import { Datum } from "./types";
import { parseDateString } from "./utils";

const CalendarHeatmapTooltip = (props: { data: Datum }) => {
  const dateString = formatTooltipDateLabel(parseDateString(props.data.day));
  const value = props.data.value;

  return <Tooltip header={dateString} body={value} />;
};

export default CalendarHeatmapTooltip;
