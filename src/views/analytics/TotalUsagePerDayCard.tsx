import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import LineChart from "../../components/LineChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface TotalUsagePerDayCardProps {
  totalDurationByDate: {
    timestamp: number;
    totalDuration: number;
  }[];
}

const TotalUsagePerDayCard = (props: TotalUsagePerDayCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Trend"
    description="Total time spent on each day"
    body={
      <LineChart
        data={props.totalDurationByDate.map(datum => ({
          x: datum.timestamp,
          y: datum.totalDuration
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  totalDurationByDate: selector.getTotalDurationByDate(state)
});

export default connect(mapStateToProps)(TotalUsagePerDayCard);
