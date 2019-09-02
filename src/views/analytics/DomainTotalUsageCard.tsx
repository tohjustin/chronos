import { connect } from "react-redux";
import React from "react";

import Card from "../../components/Card";
import { DurationCountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";

interface DomainTotalUsageCardProps {
  totalDuration: number;
}

const TRANSITION_DELAY = 1; // 1000 ms

const DomainTotalUsageCard = (props: DomainTotalUsageCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Total Usage"
    description="Total time spent on the website"
    body={
      <DurationCountUp
        start={0}
        end={props.totalDuration}
        duration={TRANSITION_DELAY}
        preserveValue={true}
        redraw={true}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  totalDuration: selectors.getSelectedDomainTotalDuration(state)
});

export default connect(mapStateToProps)(DomainTotalUsageCard);
