import classNames from "classnames";
import { Icon, Tooltip } from "evergreen-ui";
import React from "react";

import { BASE_SIZE } from "../../styles/constants";

import "./styles.scss";

interface CardProps {
  title: string;
  body?: React.ReactNode;
  className?: string;
  description?: string;
  footer?: React.ReactNode;
  info?: string;
}

const Card = (props: CardProps) => (
  <div className={classNames("card", props.className)}>
    <div
      className={classNames("card__header", {
        "card__header--with-bottom-margin": props.description !== undefined
      })}
    >
      <div className="card__header--title">
        <h2>{props.title}</h2>
        {props.info && (
          <Tooltip content={props.info}>
            {/* evergreen-ui doesn't have a no-fill version of an "info-sign" */}
            {/* icon so we need to be creative here */}
            <Icon
              icon="issue"
              size={BASE_SIZE * 1.5}
              style={{ transform: "rotate(180deg)" }}
            />
          </Tooltip>
        )}
      </div>
      {props.description && (
        <div className="card__header--description">
          <p>{props.description}</p>
        </div>
      )}
    </div>
    {props.body && <div className="card__body">{props.body}</div>}
    {props.footer && <div className="card__footer">{props.footer}</div>}
  </div>
);

export default Card;
