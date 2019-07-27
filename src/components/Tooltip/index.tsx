import React from "react";

import "./styles.scss";

interface TooltipProps {
  header: string;
  body: React.ReactNode;
  headerImageAltText?: string;
  headerImageUrl?: string;
}

const Tooltip = (props: TooltipProps) => {
  return (
    <div className="tooltip">
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
