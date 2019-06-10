import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import HeatmapChart from "../../components/HeatmapChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface DomainAverageUsageByHourOfWeekCardProps {
  data: {
    duration: number;
    hour: number;
    day: number;
  }[];
}

const DomainAverageUsageByHourOfWeekCard = (
  props: DomainAverageUsageByHourOfWeekCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--sm"
    title="Usage by Time of Day"
    description="Average time spent on each hour"
    body={
      <HeatmapChart
        data={props.data.map(datum => ({
          x: datum.day,
          y: datum.hour,
          z: datum.duration
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainAverageDurationByHourOfWeek(state)
});

export default connect(mapStateToProps)(DomainAverageUsageByHourOfWeekCard);
