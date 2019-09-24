import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";
import { TRANSITION_DELAY } from "../../styles/constants";

interface DomainRatioToTotalDurationCardProps {
  ratioToTotalDuration: number;
}

const DomainRatioToTotalDurationCard = (
  props: DomainRatioToTotalDurationCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
    title="Usage Percentage"
    description="Percentage of total browsing activity"
    body={
      <div>
        <CountUp
          start={0}
          end={props.ratioToTotalDuration * 100}
          decimals={2}
          duration={TRANSITION_DELAY / 1000}
          formattingFn={d => `${d.toFixed(2)}`}
          formattingUnitFn={() => "%"}
          preserveValue={true}
          redraw={true}
        />
      </div>
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  ratioToTotalDuration: selectors.getSelectedDomainRatioToTotalDuration(state)
});

export default connect(mapStateToProps)(DomainRatioToTotalDurationCard);
