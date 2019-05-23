import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import HeatmapChart from "../../components/HeatmapChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface AverageUsageByHourOfWeekProps {
  getAverageDurationByHourOfWeek: {
    duration: number;
    hour: number;
    day: number;
  }[];
}

const AverageUsageByHourOfWeek = (props: AverageUsageByHourOfWeekProps) => (
  <Card
    className="analytics-view__card analytics-view__card--sm"
    title="Usage by Time of Day"
    description="Average time spent on each hour"
    body={
      <HeatmapChart
        data={props.getAverageDurationByHourOfWeek.map(datum => ({
          x: datum.day,
          y: datum.hour,
          z: datum.duration
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  getAverageDurationByHourOfWeek: selector.getAverageDurationByHourOfWeek(state)
});

export default connect(mapStateToProps)(AverageUsageByHourOfWeek);
