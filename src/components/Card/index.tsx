import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

const Card = (props: CardProps) => (
  <div className={classNames("card", props.className)}>
    <div className="card__header">
      <div className="card__header--primary">
        <h2>{props.title}</h2>
        <p>{props.description}</p>
      </div>
    </div>
    <div className="card__body">{props.children}</div>
  </div>
);

export default Card;
