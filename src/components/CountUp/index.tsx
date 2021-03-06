import classNames from "classnames";
import React from "react";
import ReactCountUp from "react-countup";

import {
  MS_PER_SECOND,
  MS_PER_MINUTE,
  MS_PER_HOUR
} from "../../constants/time";

import "./styles.scss";

interface DurationCountUpProps {
  end: number;
  start: number;

  className?: string;
  delay?: number;
  decimals?: number;
  duration?: number;
  preserveValue?: boolean;
  redraw?: boolean;
  separator?: string;
}

interface CountUpProps {
  end: number;
  start: number;

  className?: string;
  delay?: number;
  decimals?: number;
  duration?: number;
  preserveValue?: boolean;
  redraw?: boolean;
  separator?: string;
  formattingFn?(value: number): string;
  formattingUnitFn?(value: number): string;
}

const formatHour = (value: number) => {
  return value < MS_PER_HOUR
    ? ""
    : Math.floor(value / MS_PER_HOUR).toLocaleString("en-US");
};
const formatMinutes = (value: number) => {
  if (value < MS_PER_MINUTE) {
    return "";
  }
  // Round up to nearest minutes (to be consistent with
  // `formatTooltipDurationLabel`)
  const hours = Math.floor(value / MS_PER_HOUR);
  const minutes = Math.round((value % MS_PER_HOUR) / MS_PER_MINUTE);
  return hours === 0 ? `${minutes}` : `${minutes}`.padStart(2, "0");
};
const formatSeconds = (value: number) => {
  return value > MS_PER_MINUTE || value < MS_PER_SECOND
    ? ""
    : `${Math.floor(value / MS_PER_SECOND)}`;
};
const formatMilliseconds = (value: number) => {
  return value > MS_PER_SECOND ? "" : `${value}`;
};

export const CountUp = ({ formattingUnitFn, ...props }: CountUpProps) => {
  return (
    <span className={classNames("count-up", props.className)}>
      <ReactCountUp className="count-up__value" {...props} />
      {formattingUnitFn && (
        <ReactCountUp
          className="count-up__unit"
          {...props}
          formattingFn={formattingUnitFn}
        />
      )}
    </span>
  );
};

export const DurationCountUp = (props: DurationCountUpProps) => {
  return (
    <span className={classNames("duration-count-up", props.className)}>
      <CountUp
        {...props}
        formattingFn={formatHour}
        formattingUnitFn={value => (formatHour(value) ? "h" : "")}
      />
      <CountUp
        {...props}
        formattingFn={formatMinutes}
        formattingUnitFn={value => (formatMinutes(value) ? "min" : "")}
      />
      <CountUp
        {...props}
        formattingFn={formatSeconds}
        formattingUnitFn={value => (formatSeconds(value) ? "s" : "")}
      />
      <CountUp
        {...props}
        formattingFn={formatMilliseconds}
        formattingUnitFn={value => (formatMilliseconds(value) ? "ms" : "")}
      />
    </span>
  );
};
