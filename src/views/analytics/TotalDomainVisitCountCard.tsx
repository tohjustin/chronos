import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";
import { TRANSITION_DELAY } from "../../styles/constants";

interface TotalDomainVisitCountCardProps {
  visitCount: number;
}

const TotalDomainVisitCountCard = (props: TotalDomainVisitCountCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Domain Visits"
    description="Total unique domains visited"
    body={
      <div>
        <CountUp
          start={0}
          end={props.visitCount}
          duration={TRANSITION_DELAY / 1000}
          formattingFn={d => d.toLocaleString("en-US")}
          formattingUnitFn={d => (d > 1 ? "domains" : "domain")}
          preserveValue={true}
          redraw={true}
        />
      </div>
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  visitCount: selectors.getTotalDomainVisitCount(state)
});

export default connect(mapStateToProps)(TotalDomainVisitCountCard);
