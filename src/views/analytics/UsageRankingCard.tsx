import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import BarChartTable from "../../components/BarChartTable";
import Card from "../../components/Card";
import { RootState, constants, selectors } from "../../store";
import { formatTableDurationLabel } from "../../utils/stringUtils";
import { computeSearchParams } from "../../utils/urlUtils";

interface UsageRankingCardProps {
  title: string;
  info: string;
  data: {
    label: string;
    value: number;
    iconSrc?: string;
    labelSrc?: string;
  }[];
  maxValue: number;
  rowCount: number;
  showIcons: boolean;
}

const TABLE_ROW_COUNT = 10;

const UsageRankingCard = (props: UsageRankingCardProps) => (
  <Card
    className="analytics-view__card analytics-view__card--md"
    title={props.title}
    info={props.info}
    body={
      props.data.length === 0 ? (
        <div className="analytics-view__placeholder">No activity</div>
      ) : (
        <BarChartTable
          data={props.data}
          maxValue={props.maxValue}
          formatValue={formatTableDurationLabel}
          rowCount={props.rowCount}
          showIcons={props.showIcons}
        />
      )
    }
  />
);

export const DomainTotalUsageRankingCard = connect((state: RootState) => {
  const rowCount = TABLE_ROW_COUNT;
  const selectedDomain = selectors.getSearchParamsSelectedDomain(state);

  return {
    title: "Usage Ranking",
    info: `Top ${rowCount} pages based on total time spent`,
    data: selectors
      .getSelectedDomainTotalDurationByPath(state)
      .slice(0, rowCount)
      .map(datum => ({
        label: datum.path,
        labelSrc: selectedDomain ? `${selectedDomain}${datum.path}` : undefined,
        value: datum.totalDuration
      })),
    maxValue: selectors.getSelectedDomainTotalDuration(state),
    rowCount,
    showIcons: false
  };
})(UsageRankingCard);

export const TotalUsageRankingCard = connect((state: RootState) => {
  const rowCount = TABLE_ROW_COUNT;
  const searchParams = selectors.getSearchParams(state);

  return {
    title: "Usage Ranking",
    info: `Top ${rowCount} websites based on total time spent`,
    data: selectors
      .getTotalDurationByDomain(state)
      .slice(0, rowCount)
      .map(datum => ({
        label: datum.domain,
        labelComponent: (
          <Link
            to={{
              search: computeSearchParams(searchParams, {
                [constants.SEARCH_PARAM_DOMAIN]: datum.domain
              }).toString()
            }}
          >
            {datum.domain}
          </Link>
        ),
        labelSrc: datum.domain,
        value: datum.totalDuration,
        iconSrc: datum.favIconUrl
      })),
    maxValue: selectors.getTotalDuration(state),
    rowCount,
    showIcons: true
  };
})(UsageRankingCard);

export default UsageRankingCard;
