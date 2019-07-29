import React from "react";

import { formatTooltipHourOfWeekLabel } from "../../utils/stringUtils";
import Tooltip from "../Tooltip";

import { Datum } from "./types";

const CalendarHeatmapTooltip = (props: { data: Datum }) => {
  const dateString = formatTooltipHourOfWeekLabel(
    props.data.day,
    props.data.hour
  );
  const duration = props.data.value;

  return <Tooltip header={dateString} body={duration} />;
};

export default CalendarHeatmapTooltip;
