import { Avatar } from "evergreen-ui";
import React, { useCallback, useEffect, useState } from "react";
import { ExternalLink } from "react-feather";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";

import { BASE_SIZE, TRANSITION_DELAY } from "../../styles/constants";

import { Datum } from "./types";

interface LabelCellProps extends Datum {
  hide: boolean;
  maxValue: number;
  showIcons: boolean;
  labelComponent?: React.ReactNode;
}

const AVATAR_SIZE = BASE_SIZE * 2;

const LabelCell = ({
  hide,
  iconSrc,
  label,
  labelComponent,
  labelSrc,
  maxValue,
  showIcons,
  value
}: LabelCellProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [inProp, setInProp] = useState(false);
  useEffect(() => {
    setInProp(true);
  }, []);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const defaultStyles = {
    transition: `width ${TRANSITION_DELAY}ms`,
    width: 0
  };
  const transitionStyles = {
    entering: { width: 0 },
    entered: { width: `${(value / maxValue) * 100}%` },
    exiting: {},
    exited: {},
    unmounted: {}
  };

  return (
    <Transition in={inProp} timeout={0}>
      {(state: TransitionStatus) => (
        <div
          className="bar-chart-table__cell"
          style={{ visibility: hide ? "hidden" : undefined }}
        >
          {showIcons && (
            <Avatar
              className="bar-chart-table__label-icon"
              src={iconSrc}
              hashValue={label}
              name={label}
              size={AVATAR_SIZE}
            />
          )}
          <div
            className="bar-chart-table__label-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="bar-chart-table__label-content">
              {labelComponent ? (
                labelComponent
              ) : (
                <span title={label}>{label}</span>
              )}
              {labelSrc && (
                <a
                  className="bar-chart-table__label-external-link"
                  href={labelSrc}
                  target="none"
                  style={{ visibility: isHovered ? "unset" : "hidden" }}
                >
                  <ExternalLink size={BASE_SIZE * 1.5} />
                </a>
              )}
            </span>
            <div
              className="bar-chart-table__label-bar"
              style={{
                ...defaultStyles,
                ...transitionStyles[state]
              }}
            ></div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default LabelCell;
