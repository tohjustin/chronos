import classNames from "classnames";
import { Button as EvergreenButton, ButtonProps } from "evergreen-ui";
import React from "react";

import "./styles.scss";

const Button = (props: ButtonProps) => {
  const appearance = props.appearance;

  return (
    <EvergreenButton
      {...props}
      className={classNames("button", props.className, {
        [`button--appearance-${appearance}`]: appearance !== undefined
      })}
      fontWeight="600"
    />
  );
};

export default Button;
