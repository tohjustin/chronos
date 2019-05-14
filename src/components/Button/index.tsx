import classNames from "classnames";
import React from "react";

import "./styles.scss";

interface ButtonProps {
  type: "primary" | "secondary";
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const Button = (props: ButtonProps) => (
  <button
    className={classNames("btn", props.className, {
      "btn--primary": props.type === "primary",
      "btn--secondary": props.type === "secondary"
    })}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export default Button;
