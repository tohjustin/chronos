import classNames from "classnames";
import React from "react";

interface BodyProps {
  children: React.ReactNode;
  className?: string;
}

const Body = (props: BodyProps) => (
  <div className={classNames("view__body", props.className)}>
    {props.children}
  </div>
);

export default Body;
