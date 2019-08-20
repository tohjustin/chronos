import React from "react";
import ReactCountUp from "react-countup";

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

  delay?: number;
  decimals?: number;
  duration?: number;
  preserveValue?: boolean;
  redraw?: boolean;
  unit?: string;
  separator?: string;
  formattingFn?(value: number): string;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;

const formatHour = (value: number) => {
  return value < MS_PER_HOUR
    ? ""
    : Math.floor(value / MS_PER_HOUR).toLocaleString("en-US");
};
const formatMinutes = (value: number) => {
  if (value < MS_PER_MINUTE) {
    return "";
  }
  const hours = Math.floor(value / MS_PER_HOUR);
  const minutes = Math.floor((value % MS_PER_HOUR) / MS_PER_MINUTE);
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
const formatUnits = (
  value: number,
  unit?: string,
  formattingFn?: (value: number) => string
): string => {
  if (
    formattingFn === undefined ||
    unit === undefined ||
    formattingFn(value) === ""
  ) {
    return "";
  }

  return unit;
};

export const CountUp = ({ unit, ...props }: CountUpProps) => {
  const { formattingFn } = props;
  const formattingUnitFn = React.useMemo(() => {
    return (value: number) => formatUnits(value, unit, formattingFn);
  }, [formattingFn, unit]);

  return (
    <>
      <ReactCountUp className="count-up__value" {...props} />
      <ReactCountUp
        className="count-up__unit"
        {...props}
        formattingFn={formattingUnitFn}
      />
    </>
  );
};

export const DurationCountUp = (props: DurationCountUpProps) => {
  return (
    <div className="duration-count-up">
      <CountUp {...props} formattingFn={formatHour} unit="h" />
      <CountUp {...props} formattingFn={formatMinutes} unit="min" />
      <CountUp {...props} formattingFn={formatSeconds} unit="s" />
      <CountUp {...props} formattingFn={formatMilliseconds} unit="ms" />
    </div>
  );
};
