import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import WeeklyHourHeatmap from "../../components/WeeklyHourHeatmap";
import { Datum } from "../../components/WeeklyHourHeatmap/types";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import {
  formatTooltipHourOfWeekLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface DomainAverageUsageByHourOfWeekCardProps {
  data: {
    duration: number;
    hour: number;
    day: number;
  }[];
}

const MS_PER_MINUTE = 1000 * 60;
const THRESHOLDS = [0, 1 / 60, 15, 30, 45, 60].map(
  minutes => minutes * MS_PER_MINUTE
);

const DomainAverageUsageByHourOfWeekCard = (
  props: DomainAverageUsageByHourOfWeekCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--sm"
    title="Usage by Time of Day"
    description="Average time spent on each hour"
    body={
      <WeeklyHourHeatmap
        colorRange={["#f6f6f6", "#3D9CF4"]}
        data={props.data.map(d => ({
          day: d.day,
          hour: d.hour,
          value: d.duration
        }))}
        legend={{
          enable: true,
          expandToChartWidth: true,
          formatLabels: (threshold: number) => {
            const minutes = threshold / MS_PER_MINUTE;
            return minutes >= 1 ? `${minutes}m` : `${minutes * 60}s`;
          },
          includeEmptyColor: false,
          margin: { left: 0, right: 0, top: 0, bottom: 8 },
          sideLabels: null
        }}
        thresholds={THRESHOLDS}
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

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainAverageDurationByHourOfWeek(state)
});

export default connect(mapStateToProps)(DomainAverageUsageByHourOfWeekCard);
