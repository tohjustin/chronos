import * as d3 from "d3";
import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import VerticalBarChart from "../../components/VerticalBarChart";
import { Datum } from "../../components/VerticalBarChart/types";
import {
  formatDayOfWeek,
  formatTooltipDayOfWeekLabel,
  formatTooltipDurationLabel
} from "../../utils/stringUtils";

interface DomainTotalUsageByDayOfWeekCardProps {
  data: {
    day: number;
    duration: number;
  }[];
}

const MS_PER_HOUR = 1000 * 60 * 60;
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

const DomainTotalUsageByDayOfWeekCard = (
  props: DomainTotalUsageByDayOfWeekCardProps
) => {
  const data = props.data.map(d => ({ x: d.day, y: d.duration }));
  const tickValuesY = computeTickValuesY(data);
  return (
    <Card
      className="analytics-view__card analytics-view__card--sm"
      title="Usage by Day of Week"
      description="Total time spent on each day of week"
      body={
        <VerticalBarChart
          data={data}
          minValue={0}
          maxValue={tickValuesY[tickValuesY.length - 1]}
          axis={{
            bottom: {
              enable: true,
              formatTick: formatTickX
            },
            left: {
              enable: true,
              formatTick: formatTickY,
              tickValues: tickValuesY
            },
            right: { enable: false },
            top: { enable: false }
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

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainTotalDurationByDayOfWeek(state)
});

export default connect(mapStateToProps)(DomainTotalUsageByDayOfWeekCard);
