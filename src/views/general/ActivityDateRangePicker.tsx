import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import DateRangePicker from "../../components/DateRangePicker";
import { DefiniteTimeRange, TimeRange } from "../../models/time";
import { ValidationStatus } from "../../models/validate";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { getEndOfDay, getStartOfDay, minusDays } from "../../utils/dateUtils";

interface ActivityDateRangePickerProps {
  activityTimeRange: DefiniteTimeRange | null;
  effectiveTimeRange: DefiniteTimeRange;
  selectedTimeRange: TimeRange;
  selectedTimeRangeValidationStatus: ValidationStatus;
  setSelectedTimeRange: (range: TimeRange | null) => void;
}

const ActivityDateRangePicker = ({
  activityTimeRange,
  effectiveTimeRange,
  selectedTimeRange,
  selectedTimeRangeValidationStatus,
  setSelectedTimeRange
}: ActivityDateRangePickerProps) => {
  // Computed values
  const [startOfToday, endOfToday] = [getStartOfDay(), getEndOfDay()];
  const [defaultStart, defaultEnd] = activityTimeRange
    ? [
        getStartOfDay(activityTimeRange.start),
        getEndOfDay(activityTimeRange.end)
      ]
    : [startOfToday, endOfToday];
  const disabledDays = {
    before: new Date(defaultStart),
    after: new Date(defaultEnd)
  };
  const month = new Date(effectiveTimeRange.start);
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
      value:
        startOfToday !== defaultStart
          ? { start: defaultStart, end: null }
          : null
    }
  ].filter(range => range.value && range.value.start >= defaultStart) as {
    label: string;
    value: TimeRange;
  }[];
  // Treat `selectedValue` as unselected if time range is invalid
  const selectedValue = selectedTimeRangeValidationStatus.isValid
    ? {
        start: selectedTimeRange.start ? effectiveTimeRange.start : null,
        end: selectedTimeRange.end ? effectiveTimeRange.end : null
      }
    : undefined;

  return (
    <DateRangePicker
      className="analytics-view__date-range-picker"
      defaultStartTime={defaultStart}
      defaultEndTime={defaultEnd}
      disabledDays={disabledDays}
      fromMonth={disabledDays.before}
      month={month}
      onChange={setSelectedTimeRange}
      position="bottom-right"
      ranges={ranges}
      toMonth={disabledDays.after}
      value={selectedValue}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  activityTimeRange: selectors.getActivityTimeRange(state),
  effectiveTimeRange: selectors.getEffectiveSelectedTimeRange(state),
  selectedTimeRange: selectors.getSelectedTimeRange(state),
  selectedTimeRangeValidationStatus: selectors.getSearchParamsSelectedTimeRangeValidationStatus(
    state
  )
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
