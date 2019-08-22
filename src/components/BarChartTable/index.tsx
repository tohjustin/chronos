import classNames from "classnames";
import * as d3 from "d3";
import { Avatar } from "evergreen-ui";
import React from "react";

import "./styles.scss";

interface BarChartTableProps {
  data: {
    label: string;
    value: number;
    labelSrc?: string;
    iconSrc?: string;
  }[];

  className?: string;
  formatValue?: (value: number) => string;
  rowCount?: number;
  showIcons?: boolean;
}

const NO_DATA_LABEL = "_NIL_";
const THEME_BASE_SIZE = 16;
const THEME_COLOR = "#3D9CF4";
const TRANSITION_DELAY = 1000; // ms

export const defaultProps = {
  rowCount: 10,
  showIcons: true
};

const BarChartTable = ({
  className,
  data,
  formatValue,
  rowCount = defaultProps.rowCount,
  showIcons = defaultProps.showIcons
}: BarChartTableProps) => {
  const rowData = [...new Array(rowCount)].map((_, index) => {
    return (
      (data && data[index]) || {
        label: NO_DATA_LABEL,
        value: 0
      }
    );
  });
  const maxValue = d3.max(rowData.map(d => d.value)) || 1;

  return (
    <div className={classNames("bar-chart-table", className)}>
      <div className="bar-chart-table__col bar-chart-table__col-index">
        {rowData.map((datum, index) => (
          <div
            key={index}
            className="bar-chart-table__cell"
            style={{
              visibility: datum.label === NO_DATA_LABEL ? "hidden" : undefined
            }}
          >
            {`${index + 1}.`}
          </div>
        ))}
      </div>
      <div className="bar-chart-table__col bar-chart-table__col-label">
        {rowData.map((datum, index) => (
          <div
            key={index}
            className="bar-chart-table__cell"
            style={{
              visibility: datum.label === NO_DATA_LABEL ? "hidden" : undefined
            }}
          >
            {showIcons && (
              <Avatar
                className="bar-chart-table__label-icon"
                src={datum.iconSrc}
                hashValue={datum.label}
                name={datum.label}
                size={THEME_BASE_SIZE}
              />
            )}
            <div className="bar-chart-table__label-content">
              {datum.labelSrc ? (
                <span>
                  <a href={datum.labelSrc} target="none">
                    {datum.label}
                  </a>
                </span>
              ) : (
                <span>{datum.label}</span>
              )}
              <div
                className="bar-chart-table__label-bar"
                style={{
                  transition: `width ${TRANSITION_DELAY}ms`,
                  borderBottomColor: THEME_COLOR,
                  width: `${(datum.value / maxValue) * 100}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bar-chart-table__col bar-chart-table__col-value">
        {rowData.map((datum, index) => (
          <div
            key={index}
            className="bar-chart-table__cell"
            style={{
              visibility: datum.label === NO_DATA_LABEL ? "hidden" : undefined
            }}
          >
            {formatValue ? formatValue(datum.value) : datum.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChartTable;
