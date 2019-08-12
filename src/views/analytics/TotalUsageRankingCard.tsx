import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import BarChartTable from "../../components/BarChartTable";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import { formatTableDurationLabel } from "../../utils/stringUtils";

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
      <BarChartTable
        data={props.getTotalDurationByDomain.map(datum => ({
          label: datum.domain,
          labelSrc: `https://${datum.domain}`,
          value: datum.totalDuration,
          iconSrc: datum.favIconUrl
        }))}
        formatValue={formatTableDurationLabel}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  getTotalDurationByDomain: selector.getTotalDurationByDomain(state)
});

export default connect(mapStateToProps)(TotalUsageRankingCard);
