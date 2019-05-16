import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import BarChart from "../../components/BarChart";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";

interface TotalUsageRankingCardProps {
  getTotalDurationByDomain: {
    totalDuration: number;
    favIconUrl: string;
    domain: string;
  }[];
}

const TotalUsageRankingCard = (props: TotalUsageRankingCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Ranking"
    description="Top sites based on total time spent"
    body={
      <BarChart
        data={props.getTotalDurationByDomain.map(datum => ({
          x: datum.totalDuration,
          y: datum.domain,
          favIconUrl: datum.favIconUrl
        }))}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  getTotalDurationByDomain: selector.getTotalDurationByDomain(state)
});

export default connect(mapStateToProps)(TotalUsageRankingCard);
