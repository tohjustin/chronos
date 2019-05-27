import React, { useEffect } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import View from "../../components/View";
import { loadActivity } from "../../store/activity/actions";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";

import AverageUsageByHourOfWeekCard from "./AverageUsageByHourOfWeekCard";
import TotalUsagePerDayCard from "./TotalUsagePerDayCard";
import TotalUsageRankingCard from "./TotalUsageRankingCard";

import "./styles.scss";

interface AnalyticsViewProps {
  isLoadingRecords: boolean;
  loadActivity: () => void;
}

const AnalyticsView = (props: AnalyticsViewProps) => {
  const { loadActivity } = props;

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  let viewContent;
  if (props.isLoadingRecords) {
    viewContent = "Loading...";
  } else {
    viewContent = (
      <>
        <div className="analytics-view__cards-container">
          <TotalUsagePerDayCard />
          <TotalUsageRankingCard />
        </div>
        <div className="analytics-view__cards-container">
          <AverageUsageByHourOfWeekCard />
        </div>
      </>
    );
  }

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

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ loadActivity }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsView);
