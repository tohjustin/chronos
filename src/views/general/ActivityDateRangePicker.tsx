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
  const handleDateRangeChange: typeof setSelectedTimeRange = range => {
    if (range && !_.isEqual(range, selectedTimeRange)) {
      setSelectedTimeRange(range);
    }
  };

  // Computed values
  const now = new Date().valueOf();
  const startOfToday = getStartOfDay(now);
  const endOfToday = getEndOfDay(now);
  const activityStartTime = activityTimeRange
    ? getStartOfDay(activityTimeRange.start)
    : startOfToday;
  const disabledDays = {
    before: new Date(activityStartTime),
    after: new Date(endOfToday)
  };
  // When the user has only one day of activity recorded, do not show the
  // "All activity" option
  const ranges = [
    {
      label: "Today",
      value: { start: startOfToday, end: endOfToday }
    },
    {
      label: "Last week",
      value: { start: startOfToday - MS_PER_DAY * 6, end: endOfToday }
    },
    {
      label: "Last 2 weeks",
      value: { start: startOfToday - MS_PER_DAY * 13, end: endOfToday }
    },
    {
      label: "Last 4 weeks",
      value: { start: startOfToday - MS_PER_DAY * 27, end: endOfToday }
    },
    {
      label: "All activity",
      value: {
        start: activityStartTime === startOfToday ? 0 : activityStartTime,
        end: endOfToday
      }
    }
  ].filter(range => range.value.start >= activityStartTime);
  const selectedStartTime = _.get(selectedTimeRange, "start", null);
  const selectedEndTime = _.get(selectedTimeRange, "end", null) || endOfToday;
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
