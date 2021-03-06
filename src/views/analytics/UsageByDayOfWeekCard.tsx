import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { MS_PER_HOUR } from "../../constants/time";
import VerticalBarChart from "../../components/VerticalBarChart";
import { Datum } from "../../components/VerticalBarChart/types";
import { RootState, selectors } from "../../store";
import {
  formatDayOfWeek,
  formatTooltipDayOfWeekLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface UsageByDayOfWeekCardProps {
  title: string;
  info: string;
  data: {
    day: number;
    duration: number;
  }[];
}

const MAX_TICK_COUNT = 5;
const MIN_STEP = MS_PER_HOUR;

const formatTickX = (x: number) => {
  return formatDayOfWeek(x)[0].toUpperCase();
};
const formatTickY = (y: number) => {
  const hours = Number(y) / MS_PER_HOUR;
  return `${hours}h`;
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

const UsageByDayOfWeekCard = (props: UsageByDayOfWeekCardProps) => {
  const data = props.data.map(d => ({ x: d.day, y: d.duration }));
  const tickValuesY = computeTickValuesY(data);
  return (
    <Card
      className="analytics-view__card analytics-view__card--sm"
      title={props.title}
      info={props.info}
      body={
        <VerticalBarChart
          data={data}
          minValue={0}
          maxValue={tickValuesY[tickValuesY.length - 1]}
          axis={{
            bottom: {
              enable: true,
              showDomain: true,
              formatTick: formatTickX
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
              enable: true
            }
          }}
          tooltipComponent={props => {
            if (props.data === null) {
              return null;
            }
            const dayOfWeek = formatTooltipDayOfWeekLabel(props.data.x);
            const duration = formatTooltipDurationLabel(props.data.y);
            return <Tooltip header={dayOfWeek} body={duration} />;
          }}
        />
      }
    />
  );
};

export const DomainTotalUsageByDayOfWeekCard = connect((state: RootState) => ({
  title: "Usage by Day of Week",
  info: "Total time spent on each day of week",
  data: selectors.getSelectedDomainTotalDurationByDayOfWeek(state)
}))(UsageByDayOfWeekCard);

export const TotalUsageByDayOfWeekCard = connect((state: RootState) => ({
  title: "Usage by Day of Week",
  info: "Total time spent on each day of week",
  data: selectors.getTotalDurationByDayOfWeek(state)
}))(UsageByDayOfWeekCard);

export default UsageByDayOfWeekCard;
