import DatePicker from "antd/lib/date-picker";
import { RangePickerValue } from "antd/lib/date-picker/interface";
import classNames from "classnames";
import moment from "moment";
import React from "react";

import "antd/lib/date-picker/style/css";
import "./styles.scss";

export type DateRangePickerValue = RangePickerValue;

interface DateRangePickerProps {
  value: [moment.Moment, moment.Moment];
  className?: string;
  disabledDate?: (current: moment.Moment | undefined) => boolean;
  format?: string | string[];
  onChange?: (dates: RangePickerValue, dateStrings: [string, string]) => void;
  ranges?: {
    [range: string]: [moment.Moment, moment.Moment];
  };
}

const DateRangePicker = (props: DateRangePickerProps) => {
  return (
    <DatePicker.RangePicker
      allowClear={false}
      className={classNames("date-range-picker", props.className)}
      dropdownClassName={classNames(
        "date-range-picker-container",
        props.className
      )}
      defaultValue={[moment().startOf("month"), moment().endOf("month")]}
      disabledDate={props.disabledDate}
      format={props.format}
      onChange={props.onChange}
      ranges={props.ranges}
      value={props.value}
    />
  );
};

export default DateRangePicker;
