import { BackButton } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import View from "../../components/View";
import { ValidationStatus } from "../../models/validate";
import { Dispatch, RootState, actions, selectors } from "../../store";
import ActivityDateRangePicker from "../general/ActivityDateRangePicker";
import ErrorView from "../general/ErrorView";
import LoadingView from "../general/LoadingView";

import DomainPicker from "./DomainPicker";
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
  const isLoadingAndHasData = isLoadingRecords && isInitialized;
  const viewBodyClassNames = isLoadingAndHasData
    ? "analytics-view__overlay-container"
    : "";
  const viewBodyOverlay = isLoadingAndHasData && <LoadingView overlay={true} />;
  switch (true) {
    case !isInitialized:
      viewBody = <LoadingView />;
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
          {selectedDomain === null ? (
            <span className="analytics-view__header-text">Usage Analytics</span>
          ) : (
            <BackButton
              className="analytics-view__header-back-button"
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
      <View.Body className={viewBodyClassNames}>
        {viewBody}
        {viewBodyOverlay}
      </View.Body>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsView);
