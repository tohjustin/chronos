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
  formattingFn?(value: number): string;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;

const formatMinutes = (value: number) => `${value}`.padStart(2, "0");

export const CountUp = (props: CountUpProps) => (
  <>
    <ReactCountUp className="count-up__value" {...props} end={props.end} />
    {props.unit && <span className="count-up__unit">{props.unit}</span>}
  </>
);

export const DurationCountUp = (props: DurationCountUpProps) => {
  const hours = Math.floor(props.end / MS_PER_HOUR);
  const minutes = Math.floor((props.end % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds =
    hours > 0 || minutes > 0
      ? undefined
      : Math.floor(props.end / MS_PER_SECOND);
  const milliseconds = props.end >= MS_PER_SECOND ? undefined : props.end;

  return (
    <div className="duration-count-up">
      {hours > 0 && <CountUp {...props} end={hours} unit="h" />}
      {minutes > 0 && (
        <CountUp
          {...props}
          end={minutes}
          formattingFn={formatMinutes}
          unit="min"
        />
      )}
      {seconds && <CountUp {...props} end={seconds} unit="s" />}
      {milliseconds && <CountUp {...props} end={milliseconds} unit="ms" />}
    </div>
  );
};
