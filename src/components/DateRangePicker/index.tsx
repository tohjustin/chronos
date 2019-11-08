import classNames from "classnames";
import * as d3 from "d3";
import { Icon, Popover, PositionTypes, IconButton } from "evergreen-ui";
import _ from "lodash";
import React, { useState } from "react";
import { DayPickerProps } from "react-day-picker";

import Button from "../Button";
import DayPicker from "../DayPicker";
import { DefiniteTimeRange } from "../../models/time";
import {
  BASE_SIZE,
  BUTTON_SIZE,
  ICON_BUTTON_SIZE
} from "../../styles/constants";

import "./styles.scss";

interface DateRangePickerProps
  extends Pick<
    DayPickerProps,
    | "disabledDays"
    | "firstDayOfWeek"
    | "fixedWeeks"
    | "fromMonth"
    | "month"
    | "onBlur"
    | "showWeekDays"
    | "showWeekNumbers"
    | "tabIndex"
    | "toMonth"
  > {
  onChange: (range: DefiniteTimeRange | null) => void;

  className?: string;
  disabled?: boolean;
  position?: PositionTypes;
  ranges?: { label: string; value: DefiniteTimeRange }[];
  value?: DefiniteTimeRange;
}

/**
 * Formats a timestamp to a date string that conforms to `MMM DD, YYYY` format
 *
 * @param timestamp - timestamp in milliseconds
 * @returns formatted date string
 */
function formatDateString(date: Date) {
  return d3.timeFormat("%b %d, %Y")(date);
}

const DateRangePicker = ({
  className,
  disabled,
  onChange,
  position,
  ranges,
  value,
  ...otherProps
}: DateRangePickerProps) => {
  const initialFrom = value ? new Date(value.start) : null;
  const initialTo = value ? new Date(value.end) : null;

  const [from, setFrom] = useState<Date | null>(initialFrom);
  const [to, setTo] = useState<Date | null>(initialTo);
  const [isSelectingFirstDay, setIsSelectingFirstDay] = useState(true);

  const handleDayClick = (day: Date) => {
    if (isSelectingFirstDay) {
      setIsSelectingFirstDay(false);
      setFrom(day);
      setTo(day);
    } else {
      setIsSelectingFirstDay(true);
      const nextFrom = from !== null && day > from ? from : day;
      const nextTo = from !== null && day > from ? day : from;
      if (nextFrom && nextTo) {
        onChange({ start: nextFrom.valueOf(), end: nextTo.valueOf() });
      }
    }
  };
  const handleDayMouseEnter = (day: Date) => {
    if (!isSelectingFirstDay) {
      setTo(day);
    }
  };
  const handleRangeClick = (range: DefiniteTimeRange) => {
    if (range) {
      setIsSelectingFirstDay(true);
      onChange(range);
    }
  };

  // Computed values
  const start = isSelectingFirstDay ? initialFrom : from;
  const end = isSelectingFirstDay ? initialTo : to;
  let modifiers: { start: Date; end: Date };
  let selectedDays: [Date, { from: Date; to: Date }];
  if (start !== null && end !== null) {
    modifiers = start < end ? { start, end } : { start: end, end: start };
    selectedDays = [start, { from: start, to: end }];
  }

  return (
    <Popover
      position={position}
      content={() => (
        <div className="date-range-picker__content">
          {ranges && (
            <div className="date-range-picker__ranges">
              {ranges.map(range => (
                <Button
                  key={range.label}
                  appearance="minimal"
                  isActive={_.isEqual(range.value, value)}
                  onClick={() => handleRangeClick(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          )}
          <DayPicker
            {...otherProps}
            modifiers={modifiers}
            numberOfMonths={2}
            onDayClick={handleDayClick}
            onDayMouseEnter={handleDayMouseEnter}
            pagedNavigation
            selectedDays={selectedDays}
            navbarElement={({
              onPreviousClick,
              onNextClick,
              showPreviousButton,
              showNextButton
            }) => {
              return (
                <div className="date-range-picker__nav-bar">
                  <IconButton
                    appearance="minimal"
                    disabled={!showPreviousButton}
                    icon="chevron-left"
                    height={ICON_BUTTON_SIZE}
                    marginRight={BASE_SIZE}
                    onClick={() => onPreviousClick()}
                  />
                  <IconButton
                    appearance="minimal"
                    disabled={!showNextButton}
                    icon="chevron-right"
                    height={ICON_BUTTON_SIZE}
                    onClick={() => onNextClick()}
                  />
                </div>
              );
            }}
          />
        </div>
      )}
    >
      <Button
        className={classNames("date-range-picker", className)}
        disabled={disabled}
        height={BUTTON_SIZE}
        iconBefore="timeline-events"
      >
        {initialFrom && initialTo ? (
          <>
            {formatDateString(initialFrom)}
            <Icon
              icon="arrow-right"
              size={BASE_SIZE}
              style={{ marginLeft: BASE_SIZE, marginRight: BASE_SIZE }}
            />
            {formatDateString(initialTo)}
          </>
        ) : (
          "Select Date Range"
        )}
      </Button>
    </Popover>
  );
};

export default DateRangePicker;
