import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp } from "../../components/CountUp";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface TotalPageVisitCountCardProps {
  visitCount: number;
}

const TRANSITION_DELAY = 1; // 1000 ms

const TotalPageVisitCountCard = (props: TotalPageVisitCountCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Page Visits"
    description="Total unique pages visited"
    body={
      <div>
        <CountUp
          start={0}
          end={props.visitCount}
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
  visitCount: selector.getTotalPageVisitCount(state)
});

export default connect(mapStateToProps)(TotalPageVisitCountCard);
