import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DateRangePicker from "../../components/DateRangePicker";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { getEndOfDay, getStartOfDay } from "../../utils/dateUtils";

interface ActivityDateRangePickerProps {
  activityTimeRange: DefiniteTimeRange | null;
  selectedTimeRange: TimeRange | null;
  setSelectedTimeRange: (range: TimeRange | null) => void;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const ActivityDateRangePicker = ({
  activityTimeRange,
  selectedTimeRange,
  setSelectedTimeRange
}: ActivityDateRangePickerProps) => {
  const handleDateRangeChange = (
    range: { start: number; end: number } | null
  ) => {
    setSelectedTimeRange(range);
  };

  // Computed values
  const now = new Date().valueOf();
  const startOfDay = getStartOfDay(now);
  const endOfDay = getEndOfDay(now);
  const activityStartTime = activityTimeRange
    ? getStartOfDay(activityTimeRange.start)
    : 0;
  const activityEndTime = activityTimeRange
    ? getEndOfDay(activityTimeRange.end)
    : endOfDay;
  const disabledDays = {
    before: new Date(activityStartTime),
    after: new Date(activityEndTime)
  };
  const ranges = [
    {
      label: "Today",
      value: { start: startOfDay, end: endOfDay }
    },
    {
      label: "Last week",
      value: { start: startOfDay - MS_PER_DAY * 6, end: endOfDay }
    },
    {
      label: "Last 2 weeks",
      value: { start: startOfDay - MS_PER_DAY * 13, end: endOfDay }
    },
    {
      label: "Last 4 weeks",
      value: { start: startOfDay - MS_PER_DAY * 27, end: endOfDay }
    },
    {
      label: "All activity",
      value: { start: activityStartTime, end: activityEndTime }
    }
  ];
  const selectedStartTime = _.get(selectedTimeRange, "start", null);
  const selectedEndTime = _.get(selectedTimeRange, "end", null) || endOfDay;
  let month: Date | undefined;
  let selectedValue: { start: number; end: number } | undefined;
  if (selectedTimeRange && selectedStartTime && selectedEndTime) {
    month = new Date(selectedStartTime);
    selectedValue = { start: selectedStartTime, end: selectedEndTime };
  }

  return (
    <DateRangePicker
      position="bottom-right"
      disabledDays={disabledDays}
      fromMonth={disabledDays.before}
      month={month}
      onChange={handleDateRangeChange}
      ranges={ranges}
      toMonth={disabledDays.after}
      value={selectedValue}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  activityTimeRange: selectors.getActivityTimeRange(state),
  selectedTimeRange: selectors.getSelectedTimeRange(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setSelectedTimeRange: actions.setSelectedTimeRange
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityDateRangePicker);
