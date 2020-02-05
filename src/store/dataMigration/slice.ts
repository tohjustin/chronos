import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import FileSaver from "file-saver";
import { batch } from "react-redux";

import packageInfo from "../../../package.json";
import { actions as activityActions } from "../activity";
import { ThunkAction } from "../types";

export interface DataMigrationState {
  exportingDatabaseRecordsError: Error | null;
  exportingDatabaseRecordsSuccess: boolean | null;
  importingDatabaseRecordsError: Error | null;
  importingDatabaseRecordsSuccess: boolean | null;
  isExportingDatabaseRecords: boolean;
  isImportingDatabaseRecords: boolean;
}

const INITIAL_STATE: DataMigrationState = {
  exportingDatabaseRecordsError: null,
  exportingDatabaseRecordsSuccess: null,
  importingDatabaseRecordsError: null,
  importingDatabaseRecordsSuccess: null,
  isExportingDatabaseRecords: false,
  isImportingDatabaseRecords: false
};

const dataMigration = createSlice({
  name: "dataMigration",
  initialState: INITIAL_STATE,
  reducers: {
    exportDatabaseRecordsStart(state: DataMigrationState) {
      state.isExportingDatabaseRecords = true;
      state.exportingDatabaseRecordsSuccess = null;
    },
    exportDatabaseRecordsFailure(
      state: DataMigrationState,
      action: PayloadAction<Error>
    ) {
      state.isExportingDatabaseRecords = false;
      state.exportingDatabaseRecordsError = action.payload;
      state.exportingDatabaseRecordsSuccess = false;
    },
    exportDatabaseRecordsSuccess(state: DataMigrationState) {
      state.isExportingDatabaseRecords = false;
      state.exportingDatabaseRecordsError = null;
      state.exportingDatabaseRecordsSuccess = true;
    },
    importDatabaseRecordsStart(state: DataMigrationState) {
      state.isImportingDatabaseRecords = true;
      state.importingDatabaseRecordsSuccess = null;
    },
    importDatabaseRecordsFailure(
      state: DataMigrationState,
      action: PayloadAction<Error>
    ) {
      state.isImportingDatabaseRecords = false;
      state.importingDatabaseRecordsError = action.payload;
      state.importingDatabaseRecordsSuccess = false;
    },
    importDatabaseRecordsSuccess(state: DataMigrationState) {
      state.isImportingDatabaseRecords = false;
      state.importingDatabaseRecordsError = null;
      state.importingDatabaseRecordsSuccess = true;
    }
  }
});

const exportDatabaseRecords = (): ThunkAction => async (
  dispatch,
  getState,
  { databaseService }
) => {
  dispatch(dataMigration.actions.exportDatabaseRecordsStart());
  try {
    if (databaseService === undefined) {
      throw Error("Unable to connect to DB");
    }

    const data = await databaseService.exportDatabaseRecords();
    const file = new File(
      [JSON.stringify(data)],
      `${packageInfo.name}_backup_${Date.now()}.json`,
      {
        type: "text/plain;charset=utf-8"
      }
    );
    FileSaver.saveAs(file);

    dispatch(dataMigration.actions.exportDatabaseRecordsSuccess());
  } catch (error) {
    console.error(error);
    dispatch(dataMigration.actions.exportDatabaseRecordsFailure(error));
  }
};

const importDatabaseRecords = (rawData: string): ThunkAction => async (
  dispatch,
  getState,
  { databaseService }
) => {
  dispatch(dataMigration.actions.importDatabaseRecordsStart());
  try {
    if (databaseService === undefined) {
      throw Error("Unable to connect to DB");
    }

    const data = JSON.parse(rawData);
    await databaseService.importDatabaseRecords(data);

    batch(() => [
      dispatch(dataMigration.actions.importDatabaseRecordsSuccess()),
      dispatch(
        activityActions.loadRecords(undefined, undefined, { forceReload: true })
      )
    ]);
  } catch (error) {
    console.error(error);
    dispatch(dataMigration.actions.importDatabaseRecordsFailure(error));
  }
};

export const actions = {
  ...dataMigration.actions,
  exportDatabaseRecords,
  importDatabaseRecords
};

export const reducer = dataMigration.reducer;
