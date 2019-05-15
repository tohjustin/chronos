import { actions as activityActions } from "./activity";
import { actions as dataMigrationActions } from "./dataMigration";

const rootActions = {
  activity: activityActions,
  dataMigration: dataMigrationActions
};

export default rootActions;
