import React from "react";
import { connect } from "react-redux";

import View from "../../components/View";
import { RootState, selectors } from "../../store";
import ActivityDateRangePicker from "../general/ActivityDateRangePicker";
import LoadingView from "../general/LoadingView";

import HistoryTable from "./HistoryTable";

import "./styles.scss";

interface HistoryViewProps {
  isLoadingRecords: boolean;
}

const HistoryView = ({ isLoadingRecords }: HistoryViewProps) => {
  let viewContent;
  switch (true) {
    case isLoadingRecords:
      viewContent = <LoadingView />;
      break;
    default:
      viewContent = <HistoryTable />;
      break;
  }

  return (
    <View.Container>
      <View.Header>
        <span className="history-view__header">
          <span>Usage History</span>
        </span>
        <span className="history-view__header">
          {!isLoadingRecords && <ActivityDateRangePicker />}
        </span>
      </View.Header>
      <View.Body>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  isLoadingRecords: selectors.getIsLoadingRecords(state)
});

export default connect(mapStateToProps)(HistoryView);
