import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { DurationCountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";

interface DomainAveragePageVisitDurationCardProps {
  averageDuration: number;
}

const TRANSITION_DELAY = 1; // 1000 ms

const DomainAveragePageVisitDurationCard = (
  props: DomainAveragePageVisitDurationCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Visit Duration"
    description="Average time spent on each page"
    body={
      <DurationCountUp
        start={0}
        end={props.averageDuration}
        duration={TRANSITION_DELAY}
        preserveValue={true}
        redraw={true}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  averageDuration: selectors.getSelectedDomainAveragePageVisitDuration(state)
});

export default connect(mapStateToProps)(DomainAveragePageVisitDurationCard);
