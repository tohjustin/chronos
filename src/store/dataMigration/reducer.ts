import { combineReducers } from "redux";
import { createReducer } from "typesafe-actions";
import { DeepReadonly } from "utility-types";

import {
  exportDatabaseRecordsAsync,
  importDatabaseRecordsAsync
} from "./actions";

type State = DeepReadonly<{
  isExportingDatabaseRecords: boolean;
  isImportingDatabaseRecords: boolean;
}>;

const INITIAL_STATE: State = {
  isExportingDatabaseRecords: false,
  isImportingDatabaseRecords: false
};

export const reducer = combineReducers({
  isExportingDatabaseRecords: createReducer(
    INITIAL_STATE.isExportingDatabaseRecords
  )
    .handleAction([exportDatabaseRecordsAsync.request], () => true)
    .handleAction(
      [exportDatabaseRecordsAsync.success, exportDatabaseRecordsAsync.failure],
      () => false
    ),
  isImportingDatabaseRecords: createReducer(
    INITIAL_STATE.isImportingDatabaseRecords
  )
    .handleAction([importDatabaseRecordsAsync.request], () => true)
    .handleAction(
      [importDatabaseRecordsAsync.success, importDatabaseRecordsAsync.failure],
      () => false
    )
});
