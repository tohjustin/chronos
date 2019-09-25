import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import WeeklyHourHeatmap, {
  defaultProps as WeeklyHourHeatmapDefaultProps
} from "../../components/WeeklyHourHeatmap";
import { Datum } from "../../components/WeeklyHourHeatmap/types";
import { RootState, selectors } from "../../store";
import { CHART_COLOR_RANGE } from "../../styles/constants";
import {
  formatTooltipHourOfWeekLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface UsageByHourOfWeekCardProps {
  title: string;
  description: string;
  data: {
    duration: number;
    hour: number;
    day: number;
  }[];
  colorRange: [string, string];
  thresholds: number[];
}

const MS_PER_MINUTE = 1000 * 60;
const THRESHOLDS = [0, 1 / 60, 15, 30, 45, 60].map(
  minutes => minutes * MS_PER_MINUTE
);

const UsageByHourOfWeekCard = (props: UsageByHourOfWeekCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--sm"
    title={props.title}
    description={props.description}
    body={
      <WeeklyHourHeatmap
        colorRange={props.colorRange}
        data={props.data.map(d => ({
          day: d.day,
          hour: d.hour,
          value: d.duration
        }))}
        legend={{
          ...WeeklyHourHeatmapDefaultProps.legend,
          formatLabels: (threshold: number) => {
            const minutes = threshold / MS_PER_MINUTE;
            return minutes >= 1 ? `${minutes}m` : `${minutes * 60}s`;
          }
        }}
        thresholds={props.thresholds}
        tooltipComponent={(props: { data: Datum }) => {
          const { day, hour, value } = props.data;
          const dateString = formatTooltipHourOfWeekLabel(day, hour);
          const duration = formatTooltipDurationLabel(value || 0);

          return <Tooltip header={dateString} body={duration} />;
        }}
      />
    }
  />
);

export const AverageUsageByHourOfWeekCard = connect((state: RootState) => ({
  title: "Usage by Time of Day",
  description: "Average time spent on each hour",
  data: selectors.getAverageDurationByHourOfWeek(state),
  colorRange: CHART_COLOR_RANGE,
  thresholds: THRESHOLDS
}))(UsageByHourOfWeekCard);

export const DomainAverageUsageByHourOfWeekCard = connect(
  (state: RootState) => ({
    title: "Usage by Time of Day",
    description: "Average time spent on each hour",
    data: selectors.getSelectedDomainAverageDurationByHourOfWeek(state),
    colorRange: CHART_COLOR_RANGE,
    thresholds: THRESHOLDS
  })
)(UsageByHourOfWeekCard);

export default UsageByHourOfWeekCard;
