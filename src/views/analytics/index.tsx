import React, { useEffect } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import Card from "../../components/Card";
import LineChart from "../../components/LineChart";
import View from "../../components/View";
import { loadActivity } from "../../store/activity/actions";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";

import "./style.scss";

interface AnalyticsViewProps {
  isLoadingRecords: boolean;
  loadActivity: () => void;
  totalDurationByDate: {
    timestamp: number;
    totalDuration: number;
  }[];
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
          <Card
            className="analytics-view__card analytics-view__card--md"
            title="Usage per day"
            description="Amount of time spent on the internet each day"
            body={
              <LineChart
                data={props.totalDurationByDate.map(datum => ({
                  x: datum.timestamp,
                  y: datum.totalDuration
                }))}
              />
            }
          />
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
  isLoadingRecords: selector.getIsLoadingRecords(state),
  totalDurationByDate: selector.getTotalDurationByDate(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators({ loadActivity }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsView);
