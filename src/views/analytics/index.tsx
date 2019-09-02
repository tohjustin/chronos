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

import AverageUsageByHourOfWeekCard from "./AverageUsageByHourOfWeekCard";
import DomainAveragePageVisitDurationCard from "./DomainAveragePageVisitDurationCard";
import DomainAverageUsageByHourOfWeekCard from "./DomainAverageUsageByHourOfWeekCard";
import DomainPicker from "./DomainPicker";
import DomainRatioToTotalDurationCard from "./DomainRatioToTotalDurationCard";
import DomainTotalPageVisitCountCard from "./DomainTotalPageVisitCountCard";
import DomainTotalUsageByDayOfWeekCard from "./DomainTotalUsageByDayOfWeekCard";
import DomainTotalUsageByDayOfYearCard from "./DomainTotalUsageByDayOfYearCard";
import DomainTotalUsageCard from "./DomainTotalUsageCard";
import DomainTotalUsagePerDayCard from "./DomainTotalUsagePerDayCard";
import DomainTotalUsageRankingCard from "./DomainTotalUsageRankingCard";
import RatioToTotalDurationCard from "./RatioToTotalDurationCard";
import TimeRangePicker from "./TimeRangePicker";
import TotalDomainVisitCountCard from "./TotalDomainVisitCountCard";
import TotalPageVisitCountCard from "./TotalPageVisitCountCard";
import TotalUsageByDayOfWeekCard from "./TotalUsageByDayOfWeekCard";
import TotalUsageCard from "./TotalUsageCard";
import TotalUsagePerDayCard from "./TotalUsagePerDayCard";
import TotalUsageRankingCard from "./TotalUsageRankingCard";

import "./styles.scss";

interface AnalyticsViewProps {
  isLoadingRecords: boolean;
  selectedDomain: string | null;
  selectedDomainValidationStatus: ValidationStatus;
  selectedTimeRangeValidationStatus: ValidationStatus;
  clearSelectedDomain: () => void;
}

const AnalyticsView = ({
  clearSelectedDomain,
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

  return (
    <View.Container>
      <View.Header>
        <span className="analytics-view__header">
          <span
            className={classNames({
              "analytics-view__link": selectedDomain !== null
            })}
            onClick={clearSelectedDomain}
          >
            Usage Analytics
          </span>
          <Icon icon="slash" size={ICON_SIZE} />
          <DomainPicker />
        </span>
        <span>
          <TimeRangePicker />
        </span>
      </View.Header>
      <View.Body>{viewContent}</View.Body>
    </View.Container>
  );
};

const mapStateToProps = (state: RootState) => ({
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
