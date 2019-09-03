import React from "react";
import { connect } from "react-redux";

import BarChartTable from "../../components/BarChartTable";
import Card from "../../components/Card";
import { RootState, selectors } from "../../store";
import { formatTableDurationLabel } from "../../utils/stringUtils";

interface DomainTotalUsageRankingCardProps {
  totalDurationByPath: {
    totalDuration: number;
    title: string;
    path: string;
  }[];
  selectedDomain: string | null;
}

const TABLE_ROW_COUNT = 10;

const DomainTotalUsageRankingCard = (
  props: DomainTotalUsageRankingCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Ranking"
    description={`Top ${TABLE_ROW_COUNT} pages based on total time spent`}
    body={
      props.totalDurationByPath.length === 0 ? (
        <div className="analytics-view__placeholder">No activity</div>
      ) : (
        <BarChartTable
          data={props.totalDurationByPath
            .slice(0, TABLE_ROW_COUNT)
            .map(datum => ({
              label: datum.path,
              labelSrc: props.selectedDomain
                ? `https://${props.selectedDomain}${datum.path}`
                : undefined,
              value: datum.totalDuration
            }))}
          formatValue={formatTableDurationLabel}
          rowCount={TABLE_ROW_COUNT}
          showIcons={false}
        />
      )
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  selectedDomain: selectors.getSelectedDomain(state),
  totalDurationByPath: selectors.getSelectedDomainTotalDurationByPath(state)
});

export default connect(mapStateToProps)(DomainTotalUsageRankingCard);
