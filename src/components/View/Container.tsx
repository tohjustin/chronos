import classNames from "classnames";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = (props: ContainerProps) => (
  <div className={classNames("view__container", props.className)}>
    {props.children}
  </div>
);

export default Container;
