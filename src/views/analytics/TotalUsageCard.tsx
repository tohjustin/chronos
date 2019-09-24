import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { DurationCountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";
import { TRANSITION_DELAY } from "../../styles/constants";

interface TotalUsageCardProps {
  totalDuration: number;
}

const TotalUsageCard = (props: TotalUsageCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Total Usage"
    description="Total time spent on the internet"
    body={
      <DurationCountUp
        start={0}
        end={props.totalDuration}
        duration={TRANSITION_DELAY / 1000}
        preserveValue={true}
        redraw={true}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  totalDuration: selectors.getTotalDuration(state)
});

export default connect(mapStateToProps)(TotalUsageCard);
