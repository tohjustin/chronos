import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import BarChartTable from "../../components/BarChartTable";
import selector from "../../store/selectors";
import { RootState } from "../../store/types";
import { formatTableDurationLabel } from "../../utils/stringUtils";

interface DomainTotalUsageRankingCardProps {
  data: {
    totalDuration: number;
    title: string;
    path: string;
  }[];
  selectedDomain: string | null;
}

const DomainTotalUsageRankingCard = (
  props: DomainTotalUsageRankingCardProps
) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title="Usage Ranking"
    description="Top sites based on total time spent"
    body={
      <BarChartTable
        data={props.data.map(datum => ({
          label: datum.path,
          labelSrc: props.selectedDomain
            ? `https://${props.selectedDomain}${datum.path}`
            : undefined,
          value: datum.totalDuration
        }))}
        formatValue={formatTableDurationLabel}
        showIcons={false}
      />
    }
  />
);

const mapStateToProps = (state: RootState) => ({
  selectedDomain: selector.getSelectedDomain(state),
  data: selector.getSelectedDomainTotalDurationByPath(state)
});

export default connect(mapStateToProps)(DomainTotalUsageRankingCard);
