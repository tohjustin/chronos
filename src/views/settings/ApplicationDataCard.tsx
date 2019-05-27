import React, { useEffect } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import Button from "../../components/Button";
import Card from "../../components/Card";
import FileUploadButton from "../../components/FileUploadButton";
import { List, ListItem } from "../../components/List";
import { useStorageEstimate } from "../../hooks";
import actions from "../../store/root-action";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";

import { formatBytes, formatDateDistance } from "./utils";

interface ApplicationDataCardProps {
  exportDatabaseRecords: () => void;
  importDatabaseRecords: (data: string) => void;
  loadActivity: () => void;
  activityDateRange: [number, number] | null;
}

const ApplicationDataCard = (props: ApplicationDataCardProps) => {
  const { loadActivity } = props;

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);
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
              props.activityDateRange
                ? formatDateDistance(props.activityDateRange[0], Date.now())
                : "-"
            }
          />
        </List>
      }
      footer={
        <div className="settings-view__button-panel">
          <FileUploadButton
            accept=".json"
            buttonType="secondary"
            onChange={handleFileUploadChange}
          >
            Import Data
          </FileUploadButton>
          <Button type="primary" onClick={props.exportDatabaseRecords}>
            Export Data
          </Button>
        </div>
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  activityDateRange: selector.getActivityDateRange(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      exportDatabaseRecords: actions.dataMigration.exportDatabaseRecords,
      importDatabaseRecords: actions.dataMigration.importDatabaseRecords,
      loadActivity: actions.activity.loadActivity
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationDataCard);
