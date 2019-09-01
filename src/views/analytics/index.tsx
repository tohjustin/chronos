import classNames from "classnames";
import { Icon } from "evergreen-ui";
import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";

import View from "../../components/View";
import actions from "../../store/root-action";
import selector from "../../store/selectors";
import { RootAction, RootState } from "../../store/types";
import { ICON_SIZE } from "../../styles/constants";

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
  isSelectedTimeRangeValid: boolean;
  selectedDomain: string | null;
  clearSelectedDomain: () => void;
}

const AnalyticsView = (props: AnalyticsViewProps) => {
  let viewContent;
  switch (true) {
    case props.isLoadingRecords:
      viewContent = "Loading...";
      break;
    case props.isSelectedTimeRangeValid === false:
      viewContent = "Invalid Time Range Selected";
      break;
    case props.selectedDomain !== null:
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
              "analytics-view__link": props.selectedDomain !== null
            })}
            onClick={props.clearSelectedDomain}
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
  isLoadingRecords: selector.getIsLoadingRecords(state),
  isSelectedTimeRangeValid: selector.getIsSelectedTimeRangeValid(state),
  selectedDomain: selector.getSelectedDomain(state)
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>) =>
  bindActionCreators(
    {
      clearSelectedDomain: () => actions.activity.setSelectedDomain(null)
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnalyticsView);
