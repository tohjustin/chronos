import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Button from "../../components/Button";
import Card from "../../components/Card";
import FileUploadButton from "../../components/FileUploadButton";
import { List, ListItem } from "../../components/List";
import { useStorageEstimate } from "../../hooks";
import { DefiniteTimeRange } from "../../models/time";
import { Dispatch, RootState, actions, selectors } from "../../store";

import { formatBytes, formatDateDistance } from "./utils";

interface ExtensionDataCardProps {
  exportDatabaseRecords: () => void;
  importDatabaseRecords: (data: string) => void;
  isLoadingRecords: boolean;
  activityTimeRange: DefiniteTimeRange | null;
}

const ExtensionDataCard = (props: ExtensionDataCardProps) => {
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
      title="Extension Data"
      description="Manage data collected & stored by the extension"
      body={
        <List className="settings-view__list">
          <ListItem
            label="Storage data used"
            isLoading={props.isLoadingRecords}
            value={`${formatBytes(storageUsage)} / ${formatBytes(
              storageQuota
            )}`}
          />
          <ListItem
            label="Total data collected"
            isLoading={props.isLoadingRecords}
            value={
              props.activityTimeRange
                ? formatDateDistance(
                    props.activityTimeRange.start,
                    props.activityTimeRange.end
                  )
                : "-"
            }
          />
        </List>
      }
      footer={
        <div className="settings-view__button-panel">
          <FileUploadButton accept=".json" onChange={handleFileUploadChange}>
            Import Data
          </FileUploadButton>
          <Button
            appearance="primary"
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
  activityTimeRange: selectors.getActivityTimeRange(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      exportDatabaseRecords: actions.exportDatabaseRecords,
      importDatabaseRecords: actions.importDatabaseRecords
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExtensionDataCard);
