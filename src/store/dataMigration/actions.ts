import FileSaver from "file-saver";
import { Dispatch } from "redux";
import { createAsyncAction } from "typesafe-actions";

import packageInfo from "../../../package.json";
import { InitDatabase } from "../../db";

export const exportDatabaseRecordsAsync = createAsyncAction(
  "EXPORT_DATABASE_RECORDS_REQUEST",
  "EXPORT_DATABASE_RECORDS_SUCCESS",
  "EXPORT_DATABASE_RECORDS_FAILURE"
)<undefined, undefined, string>();

export const exportDatabaseRecords = () => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(exportDatabaseRecordsAsync.request());
  try {
    const db = InitDatabase();
    if (db === undefined) {
      throw "Unable to initialize DB";
    }

    const data = await db.exportDatabaseRecords();
    const file = new File(
      [JSON.stringify(data)],
      `${packageInfo.name}_backup_${Date.now()}.json`,
      {
        type: "text/plain;charset=utf-8"
      }
    );
    FileSaver.saveAs(file);

    dispatch(exportDatabaseRecordsAsync.success());
  } catch (error) {
    console.error(error);
    dispatch(exportDatabaseRecordsAsync.failure(error));
  }
};

export const importDatabaseRecordsAsync = createAsyncAction(
  "IMPORT_DATABASE_RECORDS_REQUEST",
  "IMPORT_DATABASE_RECORDS_SUCCESS",
  "IMPORT_DATABASE_RECORDS_FAILURE"
)<undefined, undefined, string>();

export const importDatabaseRecords = (rawData: string) => async (
  dispatch: Dispatch
): Promise<void> => {
  dispatch(importDatabaseRecordsAsync.request());
  try {
    const db = InitDatabase();
    if (db === undefined) {
      throw "Unable to initialize DB";
    }

    const data = JSON.parse(rawData);
    await db.importDatabaseRecords(data);
    dispatch(importDatabaseRecordsAsync.success());
  } catch (error) {
    console.error(error);
    dispatch(importDatabaseRecordsAsync.failure(error));
  }
};

export const actions = {
  exportDatabaseRecords,
  exportDatabaseRecordsAsync,
  importDatabaseRecords,
  importDatabaseRecordsAsync
};
