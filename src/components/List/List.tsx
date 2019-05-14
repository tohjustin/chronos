import classNames from "classnames";
import React from "react";

interface ListBodyProps {
  children?: React.ReactNode;
  className?: string;
}

const ListBody = (props: ListBodyProps) => (
  <div className={classNames("list", props.className)}>{props.children}</div>
);

export default ListBody;
