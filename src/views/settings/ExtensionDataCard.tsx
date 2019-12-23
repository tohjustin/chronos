import { toaster } from "evergreen-ui";
import React, { useEffect, useState } from "react";
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
  exportData: () => void;
  importData: (data: string) => void;
  activityTimeRange: DefiniteTimeRange | null;
  exportDataError: Error | null;
  exportDataSuccess: boolean | null;
  importDataError: Error | null;
  importDataSuccess: boolean | null;
  isLoadingRecords: boolean;
}

const EXPORT_TOASTER_ID = "extension-data-card-import-toaster";
const IMPORT_TOASTER_ID = "extension-data-card-export-toaster";

const ExtensionDataCard = ({
  activityTimeRange,
  exportData,
  exportDataError,
  exportDataSuccess,
  importData,
  importDataError,
  importDataSuccess,
  isLoadingRecords
}: ExtensionDataCardProps) => {
  const [storageUsage] = useStorageEstimate();
  const [importDataFile, setImportDataFile] = useState<File | null>(null);
  const [showConfirmImportDialog, setShowConfirmImportDialog] = useState(false);
  const [hasShownExportToaster, setHasShownExportToaster] = useState(true);
  const [hasShownImportToaster, setHasShownImportToaster] = useState(true);
  useEffect(() => {
    if (!hasShownExportToaster) {
      if (exportDataError) {
        toaster.danger("Fail to export data", {
          id: EXPORT_TOASTER_ID,
          description: exportDataError.message
        });
        setHasShownExportToaster(true);
      }
      if (exportDataSuccess === true) {
        toaster.success("Successfully exported data", {
          id: EXPORT_TOASTER_ID
        });
        setHasShownExportToaster(true);
      }
    }
  }, [hasShownExportToaster, exportDataError, exportDataSuccess]);
  useEffect(() => {
    if (!hasShownImportToaster) {
      if (importDataError) {
        toaster.danger("Fail to import data", {
          id: IMPORT_TOASTER_ID,
          description: importDataError.message
        });
        setHasShownImportToaster(true);
      }
      if (importDataSuccess === true) {
        toaster.success("Successfully imported data", {
          id: IMPORT_TOASTER_ID
        });
        setHasShownImportToaster(true);
      }
    }
  }, [hasShownImportToaster, importDataError, importDataSuccess]);

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
          setHasShownImportToaster(false);
          importData(fileContent);
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
              label="Estimated storage data used"
              isLoading={isLoadingRecords}
              value={`${formatBytes(storageUsage)}`}
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
            onClick={() => {
              setHasShownExportToaster(false);
              exportData();
            }}
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
  exportDataError: selectors.getExportingDatabaseRecordsError(state),
  exportDataSuccess: selectors.getExportingDatabaseRecordsSuccess(state),
  importDataError: selectors.getImportingDatabaseRecordsError(state),
  importDataSuccess: selectors.getImportingDatabaseRecordsSuccess(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      exportData: actions.exportDatabaseRecords,
      importData: actions.importDatabaseRecords
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionDataCard);
