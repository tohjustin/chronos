import classNames from "classnames";
import { Icon } from "evergreen-ui";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import View from "../../components/View";
import { ValidationStatus } from "../../models/validate";
import { Dispatch, RootState, actions, selectors } from "../../store";
import { ICON_SIZE } from "../../styles/constants";
import ErrorView from "../general/ErrorView";
import LoadingView from "../general/LoadingView";

import ActivityDateRangePicker from "./ActivityDateRangePicker";
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
  hasRecords: boolean;
  isLoadingRecords: boolean;
  selectedDomain: string | null;
  selectedDomainValidationStatus: ValidationStatus;
  selectedTimeRangeValidationStatus: ValidationStatus;
  clearSelectedDomain: () => void;
}

const AnalyticsView = ({
  clearSelectedDomain,
  hasRecords,
  isLoadingRecords,
  selectedDomain,
  selectedDomainValidationStatus,
  selectedTimeRangeValidationStatus
}: AnalyticsViewProps) => {
  let viewContent;
  switch (true) {
    case isLoadingRecords:
      viewContent = <LoadingView />;
      break;
    case selectedDomainValidationStatus.isValid === false:
      viewContent = (
        <ErrorView message={selectedDomainValidationStatus.description} />
      );
      break;
    case selectedTimeRangeValidationStatus.isValid === false:
      viewContent = (
        <ErrorView message={selectedTimeRangeValidationStatus.description} />
      );
      break;
    case selectedDomain !== null:
      viewContent = (
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
      viewContent = (
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
  const headerTextClass = classNames({
    "analytics-view__link": selectedDomain !== null
  });

  return (
    <View.Container>
      <View.Header>
        <span className="analytics-view__header">
          <span className={headerTextClass} onClick={clearSelectedDomain}>
            Usage Analytics
          </span>
          {!isLoadingRecords && hasRecords && (
            <>
              <Icon icon="slash" size={ICON_SIZE} />
              <DomainPicker />
            </>
          )}
        </span>
        <span className="analytics-view__header">
          {!isLoadingRecords && <ActivityDateRangePicker />}
        </span>
      </View.Header>
      <View.Body>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
  hasRecords: selectors.getHasRecords(state),
  isLoadingRecords: selectors.getIsLoadingRecords(state),
  selectedDomainValidationStatus: selectors.getSelectedDomainValidationStatus(
    state
  ),
  selectedTimeRangeValidationStatus: selectors.getSelectedTimeRangeValidationStatus(
    state
  ),
  selectedDomain: selectors.getSelectedDomain(state)
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
