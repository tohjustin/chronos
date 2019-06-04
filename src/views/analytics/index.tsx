import React from "react";
import { connect } from "react-redux";

import View from "../../components/View";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

import AverageUsageByHourOfWeekCard from "./AverageUsageByHourOfWeekCard";
import TimeRangePicker from "./TimeRangePicker";
import TotalUsagePerDayCard from "./TotalUsagePerDayCard";
import TotalUsageRankingCard from "./TotalUsageRankingCard";

import "./styles.scss";

interface AnalyticsViewProps {
  isLoadingRecords: boolean;
}

const AnalyticsView = (props: AnalyticsViewProps) => {
  const viewContent = props.isLoadingRecords ? (
    "Loading..."
  ) : (
    <div>
      <div className="analytics-view__control-panel">
        <TimeRangePicker />
      </div>
      <div className="analytics-view__cards-container">
        <TotalUsagePerDayCard />
        <TotalUsageRankingCard />
      </div>
      <div className="analytics-view__cards-container">
        <AverageUsageByHourOfWeekCard />
      </div>
    </div>
  );

  return (
    <View.Container>
      <View.Header>Usage Analytics</View.Header>
      <View.Body>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoadingRecords: selector.getIsLoadingRecords(state)
});

export default connect(mapStateToProps)(AnalyticsView);
