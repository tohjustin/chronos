import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface TooltipProps {
  body: React.ReactNode;
  className?: string;
  header?: string;
  headerImageAltText?: string;
  headerImageUrl?: string;
}

const Tooltip = (props: TooltipProps) => {
  return (
    <div className={classNames("tooltip", props.className)}>
      <div className="tooltip__header">
        {props.headerImageUrl && (
          <img alt={props.headerImageAltText} src={props.headerImageUrl} />
        )}
        <strong>{props.header}</strong>
      </div>
      <div className="tooltip__body">{props.body}</div>
    </div>
  );
};

export default Tooltip;
