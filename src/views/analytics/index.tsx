import { BackButton } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ErrorView from "../../components/ErrorView";
import View from "../../components/View";
import ActivityDateRangePicker from "../../containers/ActivityDateRangePicker";
import DomainPicker from "../../containers/DomainPicker";
import { ValidationStatus } from "../../models/validate";
import { Dispatch, RootState, actions, selectors } from "../../store";

import {
  DomainAveragePageVisitDurationCard,
  DomainTotalPageVisitCountCard,
  DomainRatioToTotalDurationCard,
  DomainTotalUsageCard,
  RatioToTotalDurationCard,
  TotalDomainVisitCountCard,
  TotalPageVisitCountCard,
  TotalUsageCard
} from "./SingleValueMetricCard";
import {
  DomainTotalUsageByDayOfWeekCard,
  TotalUsageByDayOfWeekCard
} from "./UsageByDayOfWeekCard";
import { DomainTotalUsageByDayOfYearCard } from "./UsageByDayOfYearCard";
import {
  AverageUsageByHourOfWeekCard,
  DomainAverageUsageByHourOfWeekCard
} from "./UsageByHourOfWeekCard";
import {
  DomainTotalUsagePerDayCard,
  TotalUsagePerDayCard
} from "./UsagePerDayCard";
import {
  DomainTotalUsageRankingCard,
  TotalUsageRankingCard
} from "./UsageRankingCard";

import "./styles.scss";

interface AnalyticsViewProps {
  isInitialized: boolean;
  isLoadingRecords: boolean;
  selectedDomain: string | null;
  selectedDomainValidationStatus: ValidationStatus;
  selectedTimeRangeValidationStatus: ValidationStatus;
  clearSelectedDomain: () => void;
}

const AnalyticsView = ({
  clearSelectedDomain,
  isInitialized,
  isLoadingRecords,
  selectedDomain,
  selectedDomainValidationStatus,
  selectedTimeRangeValidationStatus
}: AnalyticsViewProps) => {
  let viewBody;
  switch (true) {
    case !isInitialized:
      viewBody = null;
      break;
    case selectedDomainValidationStatus.isValid === false:
    case selectedTimeRangeValidationStatus.isValid === false: {
      const errorDescription =
        selectedDomainValidationStatus.description ||
        selectedTimeRangeValidationStatus.description;
      viewBody = <ErrorView message={errorDescription} />;
      break;
    }
    case selectedDomain !== null:
      viewBody = (
        <div className="analytics-view__cards-container">
          <DomainTotalUsageCard />
          <DomainRatioToTotalDurationCard />
          <DomainTotalPageVisitCountCard />
          <DomainAveragePageVisitDurationCard />
          <DomainTotalUsagePerDayCard />
          <DomainTotalUsageRankingCard />
          <DomainAverageUsageByHourOfWeekCard />
          <DomainTotalUsageByDayOfWeekCard />
          <DomainTotalUsageByDayOfYearCard />
        </div>
      );
      break;
    default:
      viewBody = (
        <div className="analytics-view__cards-container">
          <TotalUsageCard />
          <RatioToTotalDurationCard />
          <TotalPageVisitCountCard />
          <TotalDomainVisitCountCard />
          <TotalUsagePerDayCard />
          <TotalUsageRankingCard />
          <AverageUsageByHourOfWeekCard />
          <TotalUsageByDayOfWeekCard />
        </div>
      );
      break;
  }

  return (
    <View.Container>
      <View.Header>
        <span className="analytics-view__header">
          {!isInitialized || selectedDomain === null ? (
            <span className="analytics-view__header-text">Usage Analytics</span>
          ) : (
            <BackButton
              className="analytics-view__header-back-button"
              disabled={isLoadingRecords}
              onClick={clearSelectedDomain}
            />
          )}
        </span>
        {isInitialized && (
          <span className="analytics-view__header">
            <DomainPicker />
            <ActivityDateRangePicker />
          </span>
        )}
      </View.Header>
      <View.Body isLoading={isLoadingRecords}>{viewBody}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  isInitialized: selectors.getIsInitialized(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state),
  selectedDomain: selectors.getSearchParamsSelectedDomain(state),
  selectedDomainValidationStatus: selectors.getSearchParamsSelectedDomainValidationStatus(
    state
  ),
  selectedTimeRangeValidationStatus: selectors.getSearchParamsSelectedTimeRangeValidationStatus(
    state
  )
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      clearSelectedDomain: () => actions.setSelectedDomain(null)
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AnalyticsView);
