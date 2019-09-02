import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import LineChart from "../../components/LineChart";
import { Datum } from "../../components/LineChart/types";
import Tooltip from "../../components/Tooltip";
import { RootState, selectors } from "../../store";
import {
  formatTooltipDateLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface TotalUsagePerDayCardProps {
  data: {
    timestamp: number;
    totalDuration: number;
  }[];
}

const MS_PER_HOUR = 1000 * 60 * 60;
const MAX_TICK_COUNT = 5;
const MIN_STEP = MS_PER_HOUR;

const formatTickX = (x: number) => {
  const date = new Date(x);
  switch (true) {
    case date.getDate() === 1:
      return d3.timeFormat("%B")(date);
    default:
      return d3.timeFormat("%a %d")(date);
  }
};
const formatTickY = (y: number) => {
  const hours = Number(y) / MS_PER_HOUR;
  return `${hours}h`;
};
const computeTickValuesX = (data: Datum[]) => {
  const startOfTheDayInMs = new Date().setHours(0, 0, 0, 0);
  const startDate = new Date(d3.min(data.map(d => d.x)) || startOfTheDayInMs);
  const endDate = new Date(d3.max(data.map(d => d.x)) || startOfTheDayInMs);
  const dayRange = d3.timeDay.count(startDate, endDate);
  const step = Math.ceil(dayRange / 5);
  return [...d3.timeDay.range(startDate, endDate, step)].map(d => d.valueOf());
};
const computeTickValuesY = (data: Datum[]) => {
  const [, max = 0] = d3.extent(data.map(d => d.y));
  if (max <= MIN_STEP) {
    return [MIN_STEP];
  }

  const multiplier = Math.max(1, Math.ceil(max / MAX_TICK_COUNT / MIN_STEP));
  const step = multiplier * MIN_STEP;
  const maxTickValue = Math.ceil(max / step) * step + 1;
  return d3.range(step, maxTickValue, step);
};

const TotalUsagePerDayCard = (props: TotalUsagePerDayCardProps) => {
  const data = props.data.map(d => ({ x: d.timestamp, y: d.totalDuration }));
  const tickValuesX = computeTickValuesX(data);
  const tickValuesY = computeTickValuesY(data);
  return (
    <Card
      className="analytics-view__card analytics-view__card--md"
      title="Usage Trend"
      description="Total time spent on each day"
      body={
        <LineChart
          data={data}
          minValue={0}
          maxValue={tickValuesY[tickValuesY.length - 1]}
          axis={{
            bottom: {
              enable: true,
              showDomain: true,
              formatTick: formatTickX,
              tickValues: tickValuesX
            },
            left: {
              enable: true,
              showDomain: true,
              formatTick: formatTickY,
              tickValues: tickValuesY
            },
            right: { enable: false, showDomain: false },
            top: { enable: false, showDomain: false }
          }}
          grid={{
            horizontal: {
              enable: true,
              tickValues: tickValuesY
            },
            vertical: {
              enable: true,
              tickValues: tickValuesX
            }
          }}
          tooltipComponent={props => {
            if (props.data === null) {
              return null;
            }
            const dayOfWeek = formatTooltipDateLabel(new Date(props.data.x));
            const duration = formatTooltipDurationLabel(props.data.y);
            return <Tooltip header={dayOfWeek} body={duration} />;
          }}
        />
      }
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  data: selectors.getTotalDurationByDate(state)
});

export default connect(mapStateToProps)(TotalUsagePerDayCard);
