import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface LoadingPlaceholderProps {
  text: string;
  className?: string;
}

const LoadingPlaceholder = (props: LoadingPlaceholderProps) => {
  return (
    <div
      className={classNames("loading-placeholder", props.className)}
      style={{ width: `${props.text.length}ch` }}
    ></div>
  );
};

export default LoadingPlaceholder;
