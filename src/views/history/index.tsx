import { IconButton } from "evergreen-ui";
import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from "../../components/Button";
import LoadingView from "../../components/LoadingView";
import View from "../../components/View";
import { Dispatch, RootState, actions, selectors } from "../../store";
import ActivityDateRangePicker from "../general/ActivityDateRangePicker";
import { ActivityRecord } from "../../models/activity";

import HistoryTable from "./HistoryTable";

import "./styles.scss";

interface HistoryViewProps {
  deleteRecords: (
    recordIds: number[],
    onSuccess?: () => void,
    onerror?: () => void
  ) => void;
  isDeletingRecords: boolean;
  isLoadingRecords: boolean;
}

const HistoryView = ({
  deleteRecords,
  isDeletingRecords,
  isLoadingRecords
}: HistoryViewProps) => {
  const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const handleCancelClick = useCallback(() => {
    setSelectedRecordIds([]);
  }, [setSelectedRecordIds]);
  const handleDeleteClick = useCallback(() => {
    deleteRecords(selectedRecordIds, () => {
      setSelectedRecordIds([]);
    });
  }, [deleteRecords, selectedRecordIds]);
  const handleRowClick = useCallback(
    (record: ActivityRecord) => {
      const recordId = record.id;
      if (recordId) {
        setSelectedRecordIds(
          selectedRecordIds.includes(recordId)
            ? selectedRecordIds.filter(id => id !== recordId)
            : [...selectedRecordIds, recordId]
        );
      }
    },
    [selectedRecordIds, setSelectedRecordIds]
  );

  let headerContent;
  let viewContent;
  const disabled = isDeletingRecords || isLoadingRecords;
  switch (true) {
    case selectedRecordIds.length > 0: {
      const headerText = isDeletingRecords
        ? "Deleting records..."
        : `${selectedRecordIds.length} ${
            selectedRecordIds.length > 1 ? "record" : "records"
          } selected`;
      headerContent = (
        <>
          <span className="history-view__header">
            <IconButton
              className="history-view__cancel-button"
              disabled={disabled}
              icon="cross"
              onClick={handleCancelClick}
            />
            <span>{headerText}</span>
          </span>
          <Button
            appearance="primary"
            className="history-view__delete-button"
            disabled={disabled}
            iconBefore="trash"
            intent="danger"
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </>
      );
      break;
    }
    default:
      headerContent = (
        <>
          <span className="history-view__header">
            <span>Usage History</span>
          </span>
          <span className="history-view__header">
            {!isLoadingRecords && <ActivityDateRangePicker />}
          </span>
        </>
      );
      break;
  }
  switch (true) {
    case isLoadingRecords:
      viewContent = <LoadingView />;
      break;
    default:
      viewContent = (
        <HistoryTable
          autoFocus={true}
          disabled={disabled}
          onRowClick={handleRowClick}
          selectedRecordIds={selectedRecordIds}
        />
      );
      break;
  }

  return (
    <View.Container>
      <View.Header>{headerContent}</View.Header>
      <View.Body>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  isDeletingRecords: selectors.getIsDeletingRecords(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ deleteRecords: actions.deleteRecords }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HistoryView);
