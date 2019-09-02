import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";

interface DomainTotalPageVisitCountCardProps {
  totalVisitCount: number;
}

const TRANSITION_DELAY = 1; // 1000 ms

const DomainTotalPageVisitCountCard = (
  props: DomainTotalPageVisitCountCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Page Visits"
    description="Total unique pages visited"
    body={
      <div>
        <CountUp
          start={0}
          end={props.totalVisitCount}
          duration={TRANSITION_DELAY}
          formattingFn={d => d.toLocaleString("en-US")}
          formattingUnitFn={d => (d > 1 ? "pages" : "page")}
          preserveValue={true}
          redraw={true}
        />
      </div>
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  totalVisitCount: selectors.getSelectedDomainTotalPageVisitCount(state)
});

export default connect(mapStateToProps)(DomainTotalPageVisitCountCard);
