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
import DomainAverageUsageByHourOfWeekCard from "./DomainAverageUsageByHourOfWeekCard";
import DomainPicker from "./DomainPicker";
import DomainTotalUsageByDayOfWeekCard from "./DomainTotalUsageByDayOfWeekCard";
import DomainTotalUsageByDayOfYearCard from "./DomainTotalUsageByDayOfYearCard";
import DomainTotalUsagePerDayCard from "./DomainTotalUsagePerDayCard";
import DomainTotalUsageRankingCard from "./DomainTotalUsageRankingCard";
import TimeRangePicker from "./TimeRangePicker";
import TotalUsageByDayOfWeekCard from "./TotalUsageByDayOfWeekCard";
import TotalUsagePerDayCard from "./TotalUsagePerDayCard";
import TotalUsageRankingCard from "./TotalUsageRankingCard";

import "./styles.scss";

interface AnalyticsViewProps {
  isLoadingRecords: boolean;
  selectedDomain: string | null;
  clearSelectedDomain: () => void;
}

const AnalyticsView = (props: AnalyticsViewProps) => {
  const viewContent = props.isLoadingRecords ? (
    "Loading..."
  ) : (
    <div>
      {props.selectedDomain === null ? (
        <>
          <div className="analytics-view__cards-container">
            <TotalUsagePerDayCard />
            <TotalUsageRankingCard />
          </div>
          <div className="analytics-view__cards-container">
            <AverageUsageByHourOfWeekCard />
            <TotalUsageByDayOfWeekCard />
          </div>
        </>
      ) : (
        <>
          <div className="analytics-view__cards-container">
            <DomainTotalUsagePerDayCard />
            <DomainTotalUsageRankingCard />
          </div>
          <div className="analytics-view__cards-container">
            <DomainAverageUsageByHourOfWeekCard />
            <DomainTotalUsageByDayOfWeekCard />
            <DomainTotalUsageByDayOfYearCard />
          </div>
        </>
      )}
    </div>
  );

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
