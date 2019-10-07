import classNames from "classnames";
import React from "react";

import LoadingPlaceholder from "../LoadingPlaceholder";

interface ListItemProps {
  label: string;
  value: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const ListItem = (props: ListItemProps) => {
  let content;
  if (props.isLoading) {
    content = <LoadingPlaceholder text={props.label} />;
  } else if (props.value !== undefined && props.value !== null) {
    content = <span>{props.value}</span>;
  } else {
    content = <span className="list-item__value--unknown">unknown</span>;
  }

  return (
    <div className={classNames("list-item", props.className)}>
      <div className="list-item__label">{props.label}</div>
      <div className="list-item__value">{content}</div>
    </div>
  );
};

export default ListItem;
