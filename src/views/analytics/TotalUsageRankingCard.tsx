import React from "react";
import { connect } from "react-redux";

import BarChartTable from "../../components/BarChartTable";
import Card from "../../components/Card";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import { formatTableDurationLabel } from "../../utils/stringUtils";

interface TotalUsageRankingCardProps {
  totalDurationByDomain: {
    totalDuration: number;
    favIconUrl: string;
    domain: string;
  }[];
}

const TABLE_ROW_COUNT = 10;

const TotalUsageRankingCard = (props: TotalUsageRankingCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Ranking"
    description={`Top ${TABLE_ROW_COUNT} websites based on total time spent`}
    body={
      <BarChartTable
        data={props.totalDurationByDomain
          .slice(0, TABLE_ROW_COUNT)
          .map(datum => ({
            label: datum.domain,
            labelSrc: `https://${datum.domain}`,
            value: datum.totalDuration,
            iconSrc: datum.favIconUrl
          }))}
        formatValue={formatTableDurationLabel}
        rowCount={TABLE_ROW_COUNT}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  totalDurationByDomain: selector.getTotalDurationByDomain(state)
});

export default connect(mapStateToProps)(TotalUsageRankingCard);
