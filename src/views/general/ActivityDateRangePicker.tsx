import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DateRangePicker from "../../components/DateRangePicker";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { getEndOfDay, getStartOfDay, minusDays } from "../../utils/dateUtils";

interface ActivityDateRangePickerProps {
  activityTimeRange: DefiniteTimeRange | null;
  selectedTimeRange: TimeRange | null;
  setSelectedTimeRange: (range: TimeRange | null) => void;
}

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
  const [startOfToday, endOfToday] = [getStartOfDay(), getEndOfDay()];
  const [startTime, endTime] = [
    activityTimeRange ? getStartOfDay(activityTimeRange.start) : startOfToday,
    endOfToday
  ];
  const disabledDays = {
    before: new Date(startTime),
    after: new Date(endTime)
  };
  const month = selectedTimeRange
    ? new Date(selectedTimeRange.start || startTime)
    : undefined;
  const ranges = [
    {
      label: "Today",
      value: { start: startOfToday, end: null }
    },
    {
      label: "Last week",
      value: { start: minusDays(startOfToday, 6), end: null }
    },
    {
      label: "Last 2 weeks",
      value: { start: minusDays(startOfToday, 13), end: null }
    },
    {
      label: "Last 4 weeks",
      value: { start: minusDays(startOfToday, 27), end: null }
    },
    {
      label: "All activity",
      value: startOfToday !== startTime ? { start: startTime, end: null } : null
    }
  ].filter(({ value }) => value && value.start >= startTime) as {
    label: string;
    value: TimeRange;
  }[];
  const selectedValue = selectedTimeRange ? selectedTimeRange : undefined;

  return (
    <DateRangePicker
      className="analytics-view__date-range-picker"
      defaultEndTime={endTime}
      defaultStartTime={startTime}
      disabledDays={disabledDays}
      fromMonth={disabledDays.before}
      month={month}
      onChange={handleDateRangeChange}
      position="bottom-right"
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
