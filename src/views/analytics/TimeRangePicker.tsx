import moment from "moment";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import DateRangePicker, {
  DateRangePickerValue
} from "../../components/DateRangePicker";
import { TimeRange } from "../../models/time";
import actions from "../../store/root-action";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";

interface TimeRangePickerProps {
  activityTimeRange: TimeRange | null;
  selectedTimeRange: TimeRange | null;
  setSelectedTimeRange: (range: TimeRange | null) => void;
}

const TimeRangePicker = (props: TimeRangePickerProps) => {
  const handleTimeRangeChange = (dates: DateRangePickerValue) => {
    const [startTime, endTime] = dates;
    const timeRange = {
      start: startTime ? startTime.valueOf() : null,
      end: endTime ? endTime.endOf("day").valueOf() : null
    };
    props.setSelectedTimeRange(timeRange);
  };

  return (
    <div>
      <h3 className="label">Selected Time Range</h3>
      <DateRangePicker
        disabledDate={current => {
          if (current && props.activityTimeRange) {
            const { start, end } = props.activityTimeRange;
            return (
              current.isBefore(start || 0, "day") ||
              current.isAfter(end || Date.now(), "day")
            );
          }
          return true;
        }}
        format="MMM DD, YYYY"
        onChange={handleTimeRangeChange}
        ranges={{
          "Last week": [moment().subtract(1, "week"), moment()],
          "Last 2 weeks": [moment().subtract(2, "week"), moment()],
          "Last 4 weeks": [moment().subtract(4, "week"), moment()],
          All: props.activityTimeRange
            ? [
                moment(props.activityTimeRange.start || 0),
                moment(props.activityTimeRange.end || undefined)
              ]
            : [moment(0), moment()]
        }}
        value={
          props.selectedTimeRange
            ? [
                moment(props.selectedTimeRange.start || undefined),
                moment(props.selectedTimeRange.end || undefined)
              ]
            : [moment(), moment()]
        }
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  activityTimeRange: selector.getActivityTimeRange(state),
  selectedTimeRange: selector.getSelectedTimeRange(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      setSelectedTimeRange: actions.activity.setSelectedTimeRange
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeRangePicker);
