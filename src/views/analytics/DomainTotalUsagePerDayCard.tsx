import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import LineChart from "../../components/LineChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface DomainTotalUsagePerDayCardProps {
  data: {
    timestamp: number;
    totalDuration: number;
  }[];
}

const DomainTotalUsagePerDayCard = (props: DomainTotalUsagePerDayCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage per Day"
    description="Amount of time spent on the site each day"
    body={
      <LineChart
        data={props.data.map(datum => ({
          x: datum.timestamp,
          y: datum.totalDuration
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainTotalDurationByDate(state)
});

export default connect(mapStateToProps)(DomainTotalUsagePerDayCard);
