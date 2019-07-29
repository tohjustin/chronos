import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import CalendarHeatmap from "../../components/CalendarHeatmap";
import { Datum } from "../../components/CalendarHeatmap/types";
import { formatDate } from "../../components/CalendarHeatmap/utils";
import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { TimeRange } from "../../models/time";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import {
  formatTooltipDateLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface DomainTotalUsageByDayOfYearCardProps {
  selectedTimeRange: TimeRange;
  totalDurationByDate: {
    timestamp: number;
    totalDuration: number;
  }[];
}

const MONTH_TO_SHOW = 6;
const MS_PER_HOUR = 1000 * 60 * 60;
const THRESHOLDS = [0, 1 / 3600, 0.5, 1, 2, 4, 8].map(
  hours => hours * MS_PER_HOUR
);

const DomainTotalUsageByDayOfYearCard = (
  props: DomainTotalUsageByDayOfYearCardProps // eslint-disable-line
) => {
  const endDate = props.selectedTimeRange.end
    ? new Date(props.selectedTimeRange.end)
    : new Date();
  const startDate = d3.timeMonth.offset(endDate, -1 * MONTH_TO_SHOW);

  return (
    <Card
      className="analytics-view__card analytics-view__card--md"
      title="Historical Usage"
      description="Total time spent over the last six months"
      body={
        <CalendarHeatmap
          colorRange={["#f6f6f6", "#3D9CF4"]}
          data={props.totalDurationByDate.map(d => ({
            day: formatDate(new Date(d.timestamp)),
            value: d.totalDuration
          }))}
          startDay={formatDate(startDate)}
          endDay={formatDate(endDate)}
          thresholds={THRESHOLDS}
          tooltipComponent={(props: { data: Datum }) => {
            const { day, value } = props.data;
            const dateString = formatTooltipDateLabel(new Date(day));
            const duration = formatTooltipDurationLabel(value || 0);

            return <Tooltip header={dateString} body={duration} />;
          }}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  totalDurationByDate: selector.getSelectedDomainTotalDurationByDate(state),
  selectedTimeRange: selector.getSelectedTimeRange(state)
});

export default connect(mapStateToProps)(DomainTotalUsageByDayOfYearCard);
