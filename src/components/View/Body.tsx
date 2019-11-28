import classNames from "classnames";
import { Spinner } from "evergreen-ui";
import React from "react";

import { SPINNER_SIZE } from "../../styles/constants";

interface BodyProps {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Body = (props: BodyProps) => (
  <div className={classNames("view__body", props.className)}>
    {props.children}
    {props.isLoading && (
      <div className="view__body--loading-overlay">
        <Spinner size={SPINNER_SIZE} />
      </div>
    )}
  </div>
);

export default Body;
