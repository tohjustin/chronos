import { toaster } from "evergreen-ui";
import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, IconButton } from "../../components/Button";
import ErrorView from "../../components/ErrorView";
import View from "../../components/View";
import ActivityDateRangePicker from "../../containers/ActivityDateRangePicker";
import { Activity } from "../../models/activity";
import { ValidationStatus } from "../../models/validate";
import { Dispatch, RootState, actions, selectors } from "../../store";

import HistoryTable from "./HistoryTable";

import "./styles.scss";

interface HistoryViewProps {
  deleteRecords: (
    recordIds: number[],
    onSuccess?: () => void,
    onerror?: (error: Error) => void
  ) => void;
  deleteRecordsError: Error | null;
  deleteRecordsSuccess: boolean | null;
  isDeletingRecords: boolean;
  isInitialized: boolean;
  isLoadingRecords: boolean;
  selectedTimeRangeValidationStatus: ValidationStatus;
}

const DELETE_TOASTER_ID = "history-view-delete-toaster";

const HistoryView = ({
  deleteRecords,
  isDeletingRecords,
  isInitialized,
  isLoadingRecords,
  selectedTimeRangeValidationStatus
}: HistoryViewProps) => {
  const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
  const handleCancelClick = useCallback(() => {
    setSelectedRecordIds([]);
  }, [setSelectedRecordIds]);
  const handleDeleteClick = useCallback(() => {
    deleteRecords(
      selectedRecordIds,
      () => {
        const count = selectedRecordIds.length;
        setSelectedRecordIds([]);
        toaster.success(
          `Successfully deleted ${count} ${count > 1 ? "record" : "records"}`,
          { id: DELETE_TOASTER_ID }
        );
      },
      error => {
        toaster.danger("Fail to delete records", {
          id: DELETE_TOASTER_ID,
          description: error.message
        });
      }
    );
  }, [deleteRecords, selectedRecordIds]);
  const handleRowClick = useCallback(
    (record: Activity) => {
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
            <span className="history-view__status">{headerText}</span>
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
          {isInitialized && (
            <span className="history-view__header">
              <ActivityDateRangePicker />
            </span>
          )}
        </>
      );
      break;
  }
  switch (true) {
    case !isInitialized:
      viewContent = null;
      break;
    case selectedTimeRangeValidationStatus.isValid === false: {
      const errorDescription = selectedTimeRangeValidationStatus.description;
      viewContent = <ErrorView message={errorDescription} />;
      break;
    }
    default:
      viewContent = (
        <HistoryTable
          autoFocus={true}
          disabled={disabled}
          isLoading={isLoadingRecords}
          onRowClick={handleRowClick}
          selectedRecordIds={selectedRecordIds}
        />
      );
      break;
  }

  return (
    <View.Container>
      <View.Header>{headerContent}</View.Header>
      <View.Body isLoading={!isInitialized}>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  isDeletingRecords: selectors.getIsDeletingRecords(state),
  isInitialized: selectors.getIsInitialized(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state),
  selectedTimeRangeValidationStatus: selectors.getSearchParamsSelectedTimeRangeValidationStatus(
    state
  )
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ deleteRecords: actions.deleteRecords }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HistoryView);
