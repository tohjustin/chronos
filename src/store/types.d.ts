import { Action } from "redux-starter-kit";
import { ThunkAction as ThunkActionType } from "redux-thunk";

import { DatabaseService } from "../db/types";

import { RootState } from "./index";

export type ThunkAction = ThunkActionType<
  void,
  RootState,
  { databaseService?: DatabaseService },
  Action<string>
>;
