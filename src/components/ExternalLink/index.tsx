import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface ExternalLinkProps {
  url: string;
  children?: React.ReactNode;
  className?: string;
  iconAlt?: string;
  iconSrc?: string;
  style?: React.CSSProperties;
  title?: string;
}

const ExternalLink = (props: ExternalLinkProps) => {
  return (
    <span
      className={classNames("external-link", props.className)}
      style={props.style}
    >
      {props.iconSrc && (
        <img
          className="external-link__icon"
          alt={props.iconAlt}
          src={props.iconSrc}
        />
      )}
      <a href={props.url} title={props.title || props.url} target="none">
        {props.children || props.url}
      </a>
    </span>
  );
};

export default ExternalLink;
