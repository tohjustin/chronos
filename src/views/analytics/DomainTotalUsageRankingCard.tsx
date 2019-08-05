import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import BarChart from "../../components/BarChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface DomainTotalUsageRankingCardProps {
  data: {
    totalDuration: number;
    title: string;
    path: string;
  }[];
}

const DomainTotalUsageRankingCard = (
  props: DomainTotalUsageRankingCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Ranking"
    description="Top sites based on total time spent"
    body={
      <BarChart
        data={props.data.map(datum => ({
          x: datum.totalDuration,
          y: datum.path,
          favIconUrl: undefined
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  data: selector.getSelectedDomainTotalDurationByPath(state)
});

export default connect(mapStateToProps)(DomainTotalUsageRankingCard);
