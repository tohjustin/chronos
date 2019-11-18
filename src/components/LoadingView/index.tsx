import classNames from "classnames";
import { Spinner } from "evergreen-ui";
import React from "react";

import { SPINNER_SIZE } from "../../styles/constants";

import "./styles.scss";

interface LoadingViewProps {
  className?: string;
  overlay?: boolean;
}

const LoadingView = (props: LoadingViewProps) => {
  return (
    <div
      className={classNames(
        {
          "loading-view__container": true,
          "loading-view__container--overlay": props.overlay
        },
        props.className
      )}
    >
      <Spinner size={SPINNER_SIZE} />
    </div>
  );
};

export default LoadingView;
