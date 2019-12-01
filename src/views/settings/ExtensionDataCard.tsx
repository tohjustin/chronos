import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Dialog from "../../components/Dialog";
import FileUploadButton from "../../components/FileUploadButton";
import { List, ListItem } from "../../components/List";
import { useStorageEstimate } from "../../hooks";
import { DefiniteTimeRange } from "../../models/time";
import { Dispatch, RootState, actions, selectors } from "../../store";

import { formatBytes, formatDateDistance } from "./utils";

interface ExtensionDataCardProps {
  exportDatabaseRecords: () => void;
  importDatabaseRecords: (data: string) => void;
  activityTimeRange: DefiniteTimeRange | null;
  isLoadingRecords: boolean;
}

const ExtensionDataCard = ({
  activityTimeRange,
  exportDatabaseRecords,
  importDatabaseRecords,
  isLoadingRecords
}: ExtensionDataCardProps) => {
  const [importDataFile, setImportDataFile] = useState<File | null>(null);
  const [showConfirmImportDialog, setShowConfirmImportDialog] = useState<
    boolean
  >(false);
  const [storageUsage, storageQuota] = useStorageEstimate();

  const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const [uploadedFile] = e.target.files;
      setImportDataFile(uploadedFile);
      setShowConfirmImportDialog(true);
    }
  };
  const handleImportDataConfirm = (close: () => void) => {
    close();
    if (importDataFile) {
      const reader = new FileReader();

      reader.onload = () => {
        const fileContent = reader.result;
        if (typeof fileContent === "string") {
          importDatabaseRecords(fileContent);
        }
      };
      reader.readAsText(importDataFile);
    }
  };

  return (
    <Card
      className="settings-view__card settings-view__card--md"
      title="Extension Data"
      description="Manage data collected & stored by the extension"
      body={
        <>
          <List className="settings-view__list">
            <ListItem
              label="Storage data used"
              isLoading={isLoadingRecords}
              value={`${formatBytes(storageUsage)} / ${formatBytes(
                storageQuota
              )}`}
            />
            <ListItem
              label="Total data collected"
              isLoading={isLoadingRecords}
              value={
                activityTimeRange
                  ? formatDateDistance(
                      activityTimeRange.start,
                      activityTimeRange.end
                    )
                  : "-"
              }
            />
          </List>
          <Dialog
            confirmLabel="Proceed & Overwrite Data"
            hasClose={false}
            intent="danger"
            isShown={showConfirmImportDialog}
            onConfirm={handleImportDataConfirm}
            onCloseComplete={() => {
              setShowConfirmImportDialog(false);
              setImportDataFile(null);
            }}
            title="Import Data"
          >
            This action will overwrite existing application data with the
            imported data. Do you still want to proceed?
          </Dialog>
        </>
      }
      footer={
        <div className="settings-view__button-panel">
          <FileUploadButton accept=".json" onChange={handleFileUploadChange}>
            Import Data
          </FileUploadButton>
          <Button
            appearance="primary"
            iconBefore="export"
            onClick={exportDatabaseRecords}
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

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionDataCard);
