import { Button } from "evergreen-ui";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import Card from "../../components/Card";
import FileUploadButton from "../../components/FileUploadButton";
import { List, ListItem } from "../../components/List";
import { useStorageEstimate } from "../../hooks";
import { TimeRange } from "../../models/time";
import actions from "../../store/root-action";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";
import { BUTTON_MARGIN, BUTTON_SIZE } from "../../styles/constants";

import { formatBytes, formatDateDistance } from "./utils";

interface ApplicationDataCardProps {
  exportDatabaseRecords: () => void;
  importDatabaseRecords: (data: string) => void;
  activityTimeRange: TimeRange | null;
}

const ApplicationDataCard = (props: ApplicationDataCardProps) => {
  const [storageUsage, storageQuota] = useStorageEstimate();

  function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const [uploadedFile] = e.target.files;
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;
        if (typeof fileContent !== "string") {
          return;
        }
        props.importDatabaseRecords(fileContent);
      };
      reader.readAsText(uploadedFile);
    }
  }

  return (
    <Card
      className="settings-view__card settings-view__card--md"
      title="Application Data"
      description="Manage data collected & stored by the extension"
      body={
        <List className="settings-view__list">
          <ListItem
            label="Storage data used"
            value={`${formatBytes(storageUsage)} / ${formatBytes(
              storageQuota
            )}`}
          />
          <ListItem
            label="Total data collected"
            value={
              props.activityTimeRange && props.activityTimeRange.start
                ? formatDateDistance(props.activityTimeRange.start, Date.now())
                : "-"
            }
          />
        </List>
      }
      footer={
        <div className="settings-view__button-panel">
          <FileUploadButton
            accept=".json"
            height={BUTTON_SIZE}
            marginRight={BUTTON_MARGIN}
            onChange={handleFileUploadChange}
          >
            Import Data
          </FileUploadButton>
          <Button
            appearance="primary"
            className="primary-btn"
            height={BUTTON_SIZE}
            iconBefore="export"
            onClick={props.exportDatabaseRecords}
          >
            Export Data
          </Button>
        </div>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  activityTimeRange: selector.getActivityTimeRange(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      exportDatabaseRecords: actions.dataMigration.exportDatabaseRecords,
      importDatabaseRecords: actions.dataMigration.importDatabaseRecords
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDataCard);
