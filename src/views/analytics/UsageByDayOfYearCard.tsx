import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import CalendarHeatmap from "../../components/CalendarHeatmap";
import { Datum } from "../../components/CalendarHeatmap/types";
import {
  formatDate,
  parseDateString
} from "../../components/CalendarHeatmap/utils";
import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { HISTORICAL_USAGE_TIME_WINDOW } from "../../constants/analytics";
import { MS_PER_HOUR } from "../../constants/time";
import { TimeRange } from "../../models/time";
import { RootState, selectors } from "../../store";
import { CHART_COLOR_RANGE } from "../../styles/constants";
import {
  formatTooltipDateLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface UsageByDayOfYearCardProps {
  title: string;
  info: string;
  data: {
    timestamp: number;
    totalDuration: number;
  }[];
  colorRange: [string, string];
  monthsToShow: number;
  selectedTimeRange: TimeRange;
  thresholds: number[];
}

const THRESHOLDS = [0, 1 / 3600, 0.5, 1, 2, 4].map(
  hours => hours * MS_PER_HOUR
);

const UsageByDayOfYearCard = (props: UsageByDayOfYearCardProps) => {
  const endDate = props.selectedTimeRange.end
    ? new Date(props.selectedTimeRange.end)
    : new Date();
  const startDate = d3.timeMonth.offset(endDate, -1 * props.monthsToShow);

  return (
    <Card
      className="analytics-view__card analytics-view__card--md"
      title={props.title}
      info={props.info}
      body={
        <CalendarHeatmap
          colorRange={props.colorRange}
          data={props.data.map(d => ({
            day: formatDate(new Date(d.timestamp)),
            value: d.totalDuration
          }))}
          startDay={formatDate(startDate)}
          endDay={formatDate(endDate)}
          thresholds={props.thresholds}
          tooltipComponent={(props: { data: Datum }) => {
            const { day, value } = props.data;
            const dateString = formatTooltipDateLabel(parseDateString(day));
            const duration = formatTooltipDurationLabel(value || 0);

            return <Tooltip header={dateString} body={duration} />;
          }}
        />
      }
    />
  );
};

export const DomainTotalUsageByDayOfYearCard = connect((state: RootState) => {
  const monthsToShow = HISTORICAL_USAGE_TIME_WINDOW;
  return {
    title: "Historical Usage",
    info: `Total time spent over the past ${monthsToShow} months`,
    data: selectors.getAllSelectedDomainTotalDurationByDate(state),
    colorRange: CHART_COLOR_RANGE,
    monthsToShow,
    selectedTimeRange: selectors.getSelectedTimeRange(state),
    thresholds: THRESHOLDS
  };
})(UsageByDayOfYearCard);

export default UsageByDayOfYearCard;
