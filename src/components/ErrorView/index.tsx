import classNames from "classnames";
import React from "react";
import { AlertCircle } from "react-feather";

import "./styles.scss";

interface ErrorViewProps {
  message: string;
  className?: string;
}

const ErrorView = (props: ErrorViewProps) => {
  return (
    <div className={classNames("error-view__container", props.className)}>
      <div className="error-view__content">
        <AlertCircle />
        <span>{props.message}</span>
      </div>
    </div>
  );
};

export default ErrorView;
