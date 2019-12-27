import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { MS_PER_HOUR, MS_PER_MINUTE } from "../../constants/time";
import VerticalBarChart from "../../components/VerticalBarChart";
import { Datum } from "../../components/VerticalBarChart/types";
import {
  DURATION_BUCKET_SIZE,
  MAX_BUCKET_COUNT
} from "../../constants/analytics";
import { RootState, selectors } from "../../store";
import {
  formatTooltipDurationBucketLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface UsageDistributionCardProps {
  title: string;
  info: string;
  data: {
    bucket: number;
    duration: number;
  }[];
}

const MIN_STEP_X = 10;
const MIN_STEP_Y = MS_PER_HOUR;
const MAX_TICK_Y_COUNT = 5;

const formatTickX = (x: number) => {
  const duration = Number(x) * DURATION_BUCKET_SIZE;
  const minutes = Math.round(duration / MS_PER_MINUTE);
  if (minutes > 1) {
    return `${minutes}m`;
  }
  const seconds = Math.round(duration / 1000);
  return `${seconds}s`;
};
const computeTickValuesX = (data: Datum[]) => {
  const [, max = 0] = d3.extent(data.map(d => d.x));
  const step = MIN_STEP_X;
  const maxTickValue = Math.ceil(max / step) * step;
  return d3.range(step, maxTickValue, step);
};
const formatTickY = (y: number) => {
  const hours = Number(y) / MS_PER_HOUR;
  return `${hours}h`;
};
const computeTickValuesY = (data: Datum[]) => {
  const [, max = 0] = d3.extent(data.map(d => d.y));
  if (max <= MIN_STEP_Y) {
    return [MIN_STEP_Y];
  }

  const multiplier = Math.max(
    1,
    Math.ceil(max / MAX_TICK_Y_COUNT / MIN_STEP_Y)
  );
  const step = multiplier * MIN_STEP_Y;
  const maxTickValue = Math.ceil(max / step) * step + 1;
  return d3.range(step, maxTickValue, step);
};

const UsageDistributionCard = (props: UsageDistributionCardProps) => {
  const data = props.data.map((d, index) => ({ x: index, y: d.duration }));
  const tickValuesX = computeTickValuesX(data);
  const tickValuesY = computeTickValuesY(data);
  return (
    <Card
      className="analytics-view__card analytics-view__card--md"
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

            const durationBucket = formatTooltipDurationBucketLabel(
              props.data.x,
              DURATION_BUCKET_SIZE,
              MAX_BUCKET_COUNT
            );
            const duration = formatTooltipDurationLabel(props.data.y);
            return <Tooltip header={durationBucket} body={duration} />;
          }}
        />
      }
    />
  );
};

export const DomainTotalUsageDistributionCard = connect((state: RootState) => ({
  title: "Usage Distribution",
  info: "Total time spent by duration of each page view",
  data: selectors.getSelectedDomainTotalDurationByDurationBuckets(state)
}))(UsageDistributionCard);

export const TotalUsageDistributionCard = connect((state: RootState) => ({
  title: "Usage Distribution",
  info: "Total time spent by duration of each page view",
  data: selectors.getTotalDurationByDurationBuckets(state)
}))(UsageDistributionCard);

export default UsageDistributionCard;
