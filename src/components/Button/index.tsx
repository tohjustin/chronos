import classNames from "classnames";
import {
  Button as EvergreenButton,
  ButtonProps,
  IconButton as EvergreenIconButton,
  IconButtonProps
} from "evergreen-ui";
import React from "react";

import "./styles.scss";

export const Button = (props: ButtonProps) => {
  const appearance = props.appearance;
  const intent = props.intent;

  return (
    <EvergreenButton
      {...props}
      className={classNames("button", props.className, {
        [`button--appearance-${appearance}`]: appearance !== undefined,
        [`button--intent-${intent}`]: intent !== undefined
      })}
      fontWeight="600"
    />
  );
};

export const IconButton = (props: IconButtonProps) => {
  const appearance = props.appearance;
  const intent = props.intent;

  return (
    <EvergreenIconButton
      {...props}
      className={classNames("button", props.className, {
        [`button--appearance-${appearance}`]: appearance !== undefined,
        [`button--intent-${intent}`]: intent !== undefined
      })}
      fontWeight="600"
    />
  );
};
