import React from "react";
import { connect } from "react-redux";

import Card from "../../components/Card";
import { CountUp, DurationCountUp } from "../../components/CountUp";
import { RootState, selectors } from "../../store";
import { TRANSITION_DELAY } from "../../styles/constants";

interface SingleValueMetricCardProps {
  title: string;
  description: string;
  data: number;
  isDuration: boolean;
  decimals?: number;
  formattingFn?: (d: number) => string;
  formattingUnitFn?: (d: number) => string;
}

const SingleValueMetricCard = (props: SingleValueMetricCardProps) => {
  const Component = props.isDuration ? DurationCountUp : CountUp;
  return (
    <Card
      className="analytics-view__card analytics-view__card--responsive analytics-view__card--sm"
      title={props.title}
      description={props.description}
      body={
        <div>
          <Component
            start={0}
            end={props.data}
            decimals={props.decimals}
            duration={TRANSITION_DELAY / 1000}
            formattingFn={props.formattingFn}
            formattingUnitFn={props.formattingUnitFn}
            preserveValue={true}
            redraw={true}
          />
        </div>
      }
    />
  );
};

export const DomainAveragePageVisitDurationCard = connect(
  (state: RootState) => ({
    title: "Visit Duration",
    description: "Average time spent on each page",
    data: selectors.getSelectedDomainAveragePageVisitDuration(state),
    isDuration: true
  })
)(SingleValueMetricCard);

export const DomainRatioToTotalDurationCard = connect((state: RootState) => ({
  title: "Usage Percentage",
  description: "Percentage of total browsing activity",
  data: selectors.getSelectedDomainRatioToTotalDuration(state) * 100,
  isDuration: false,
  decimals: 2,
  formattingFn: (d: number) => `${d.toFixed(2)}`,
  formattingUnitFn: () => "%"
}))(SingleValueMetricCard);

export const DomainTotalPageVisitCountCard = connect((state: RootState) => ({
  title: "Page Visits",
  description: "Total unique pages visited",
  data: selectors.getSelectedDomainTotalPageVisitCount(state),
  isDuration: false,
  formattingFn: (d: number) => d.toLocaleString("en-US"),
  formattingUnitFn: (d: number) => (d > 1 ? "pages" : "page")
}))(SingleValueMetricCard);

export const DomainTotalUsageCard = connect((state: RootState) => ({
  title: "Total Usage",
  description: "Total time spent on the website",
  data: selectors.getSelectedDomainTotalDuration(state),
  isDuration: true
}))(SingleValueMetricCard);

export const RatioToTotalDurationCard = connect((state: RootState) => ({
  title: "Usage Percentage",
  description: "Percentage of total time range",
  data: selectors.getRatioToTotalDuration(state) * 100,
  isDuration: false,
  decimals: 2,
  formattingFn: (d: number) => `${d.toFixed(2)}`,
  formattingUnitFn: () => "%"
}))(SingleValueMetricCard);

export const TotalDomainVisitCountCard = connect((state: RootState) => ({
  title: "Domain Visits",
  description: "Total unique domains visited",
  data: selectors.getTotalDomainVisitCount(state),
  isDuration: false,
  formattingFn: (d: number) => d.toLocaleString("en-US"),
  formattingUnitFn: (d: number) => (d > 1 ? "domains" : "domain")
}))(SingleValueMetricCard);

export const TotalPageVisitCountCard = connect((state: RootState) => ({
  title: "Page Visits",
  description: "Total unique pages visited",
  data: selectors.getTotalPageVisitCount(state),
  isDuration: false,
  formattingFn: (d: number) => d.toLocaleString("en-US"),
  formattingUnitFn: (d: number) => (d > 1 ? "pages" : "page")
}))(SingleValueMetricCard);

export const TotalUsageCard = connect((state: RootState) => ({
  title: "Total Usage",
  description: "Total time spent on the internet",
  data: selectors.getTotalDuration(state),
  isDuration: true
}))(SingleValueMetricCard);

export default SingleValueMetricCard;
