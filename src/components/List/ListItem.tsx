import classNames from "classnames";
import React from "react";

interface ListItemProps {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
}

const ListItem = (props: ListItemProps) => (
  <div className={classNames("list-item", props.className)}>
    <div className="list-item__label">{props.label}</div>
    <div className="list-item__value">{props.value}</div>
  </div>
);

export default ListItem;
