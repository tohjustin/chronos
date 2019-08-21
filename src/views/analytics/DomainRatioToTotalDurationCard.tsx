import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp } from "../../components/CountUp";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface DomainRatioToTotalDurationCardProps {
  ratioToTotalDuration: number;
}

const TRANSITION_DELAY = 1; // 1000 ms

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
          duration={TRANSITION_DELAY}
          formattingFn={d => `${d.toFixed(2)}`}
          preserveValue={true}
          redraw={true}
          unit="%"
        />
      </div>
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  ratioToTotalDuration: selector.getSelectedDomainRatioToTotalDuration(state)
});

export default connect(mapStateToProps)(DomainRatioToTotalDurationCard);
