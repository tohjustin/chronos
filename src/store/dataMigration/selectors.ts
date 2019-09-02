import { RootState } from "../../store";

/**
 * Retrieves the status of exporting database records
 */
export const getIsExportingDatabaseRecords = (state: RootState) => {
  return state.dataMigration.isExportingDatabaseRecords;
};

/**
 * Retrieves the error occurred from exporting database records
 */
export const getExportingDatabaseRecordsError = (state: RootState) => {
  return state.dataMigration.exportingDatabaseRecordsError;
};

/**
 * Retrieves the status of importing database records
 */
export const getIsImportingDatabaseRecords = (state: RootState) => {
  return state.dataMigration.isImportingDatabaseRecords;
};

/**
 * Retrieves the error occurred from importing database records
 */
export const getImportingDatabaseRecordsError = (state: RootState) => {
  return state.dataMigration.importingDatabaseRecordsError;
};
